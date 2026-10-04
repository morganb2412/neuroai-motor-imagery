#!/usr/bin/env python3
"""Generate, process, verify and mix AI announcements. Credentials stay server-side."""
import argparse, hashlib, json, math, os, shutil, subprocess, sys, urllib.request, urllib.error, wave
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CONFIG=ROOT/'src/video/data/aiVoice.config.json'
GENERATED=ROOT/'src/video/data/aiVoice.generated.json'
PUBLIC=ROOT/'public/audio/ai'
OUT=ROOT.parent/'out'

def load_env():
    p=ROOT/'.env'
    if p.exists():
        for line in p.read_text().splitlines():
            if line.strip() and not line.lstrip().startswith('#') and '=' in line:
                key,value=line.split('=',1)
                os.environ.setdefault(key.strip(),value.strip().strip('\"\''))

def binary(name):
    override=os.getenv(name.upper()+'_PATH')
    if override:return override
    found=shutil.which(name)
    if found:return found
    if name=='ffmpeg':
        try:
            import imageio_ffmpeg
            return imageio_ffmpeg.get_ffmpeg_exe()
        except ImportError:pass
    bundled=ROOT/'node_modules/@remotion/compositor-darwin-arm64'/name
    if bundled.exists() and name=='ffprobe':return str(bundled)
    raise RuntimeError(f'Install full FFmpeg or set {name.upper()}_PATH. Remotion’s minimal FFmpeg lacks voice-processing filters.')

def run(args):
    env={**os.environ,'DYLD_LIBRARY_PATH':str(ROOT/'node_modules/@remotion/compositor-darwin-arm64')}
    return subprocess.check_output([str(a) for a in args],env=env,stderr=subprocess.STDOUT)

def wav_info(path):
    with wave.open(str(path),'rb') as w:
        if w.getsampwidth()!=2:raise RuntimeError(f'{path}: expected PCM16 WAV')
        frames=len(w.readframes(w.getnframes()))/(w.getsampwidth()*w.getnchannels())
        return {'duration':frames/w.getframerate(),'sampleRate':w.getframerate(),'channels':w.getnchannels()}

def generate(config,force=False):
    key=os.getenv('OPENAI_API_KEY')
    if not key:raise RuntimeError('OPENAI_API_KEY is missing. Set it in the environment or video/.env (never in chat). No substitute speech has been generated.')
    for clip in config['clips']:
        path=PUBLIC/'raw'/f"{clip['id']}.wav"
        if path.exists() and not force:
            wav_info(path);print('Reusing raw:',clip['id']);continue
        payload={'model':os.getenv('OPENAI_TTS_MODEL',config['model']),'voice':os.getenv('OPENAI_TTS_VOICE',config['voice']),'input':clip['text'],'instructions':config['instructions'],'speed':config['speed'],'response_format':'wav'}
        req=urllib.request.Request('https://api.openai.com/v1/audio/speech',data=json.dumps(payload).encode(),headers={'Authorization':f'Bearer {key}','Content-Type':'application/json'},method='POST')
        try:
            with urllib.request.urlopen(req,timeout=120) as r:data=r.read()
        except urllib.error.HTTPError as e:
            raise RuntimeError(f'OpenAI speech API returned HTTP {e.code}; check model access, billing and API key.') from None
        if data[:4]!=b'RIFF':raise RuntimeError('API returned non-WAV data')
        path.parent.mkdir(parents=True,exist_ok=True)
        tmp=path.with_suffix('.tmp');tmp.write_bytes(data)
        run([binary('ffmpeg'),'-y','-v','error','-i',tmp,'-ar','24000','-ac','1','-c:a','pcm_s16le',path])
        tmp.unlink()
        wav_info(path);print('Generated raw:',clip['id'])

def process_one(source,target,settings):
    rate=wav_info(source)['sampleRate']; ratio=2**(settings['pitchSemitones']/12)
    # Gentle pitch reduction, compensated tempo, mono-compatible ambience, conservative limiter.
    filters=f"asetrate={round(rate*ratio)},aresample=48000,atempo={1/ratio:.8f},highpass=f=75,bass=g={settings['bassGainDb']}:f=140:w=0.7,equalizer=f=3200:t=q:w=0.8:g={settings['clarityGainDb']},acompressor=threshold=0.125:ratio=2:attack=12:release=100:makeup=1.1,aecho=0.8:0.9:24:{settings['reverbMix']},loudnorm=I={settings['targetLUFS']}:TP=-2:LRA=7,alimiter=limit=0.79:level=false,aformat=sample_rates=48000:channel_layouts=stereo"
    target.parent.mkdir(parents=True,exist_ok=True)
    run([binary('ffmpeg'),'-y','-v','error','-i',source,'-af',filters,'-c:a','pcm_s16le',target])
    target.with_suffix('.json').write_text(json.dumps({'settings':settings,'rawSHA256':hashlib.sha256(source.read_bytes()).hexdigest()},indent=2))
    return wav_info(target)

def process(config):
    for clip in config['clips']:
        src=PUBLIC/'raw'/f"{clip['id']}.wav"
        if not src.exists():raise RuntimeError(f'Missing raw TTS: {src}')
        dst=PUBLIC/'processed'/src.name
        info=process_one(src,dst,config['processing']);print('Processed:',clip['id'],f"{info['duration']:.2f}s")

def total_frames():
    # Read the same scene-duration source consumed by Remotion, rather than duplicate 60s.
    import re
    return round(sum(float(v) for v in re.findall(r'seconds:\s*([0-9.]+)',(ROOT/'src/video/data/timing.ts').read_text()))*30)

def verify(config,write=True):
    clips=[]
    for clip in config['clips']:
        raw=PUBLIC/'raw'/f"{clip['id']}.wav";processed=PUBLIC/'processed'/raw.name
        if not raw.exists() or not processed.exists():raise RuntimeError(f'Missing clip versions: {clip["id"]}')
        wav_info(raw);info=wav_info(processed)
        provenance=processed.with_suffix('.json')
        if not provenance.exists():raise RuntimeError('Processing provenance missing; run ai:process')
        provenance=json.loads(provenance.read_text())
        if provenance['settings']!=config['processing'] or provenance['rawSHA256']!=hashlib.sha256(raw.read_bytes()).hexdigest():raise RuntimeError('Raw audio or processing settings changed; run ai:process')
        if info['duration']<=0:raise RuntimeError('Empty audio')
        if info['sampleRate']!=48000 or info['channels']!=2:raise RuntimeError('Processed audio must be 48 kHz stereo')
        frames=math.ceil(info['duration']*30)
        if clip['startFrame']<0 or not 0<=clip['volume']<=1:raise RuntimeError('Invalid timing or volume')
        clips.append({**clip,'durationInFrames':frames,'durationSeconds':info['duration'],'processedSHA256':hashlib.sha256(processed.read_bytes()).hexdigest()})
    ordered=sorted(clips,key=lambda c:c['startFrame'])
    for prev,nxt in zip(ordered,ordered[1:]):
        if prev['startFrame']+prev['durationInFrames']>nxt['startFrame']:
            raise RuntimeError(f'AI clips overlap: {prev["id"]} and {nxt["id"]}. Edit startFrame in aiVoice.config.json.')
    if max(c['startFrame']+c['durationInFrames'] for c in clips)>total_frames():
        raise RuntimeError('A voice clip extends beyond the video. Edit timing.ts or the clip startFrame; speech will not be silently trimmed.')
    if write:GENERATED.write_text(json.dumps({'ready':True,'config':config,'clips':clips},indent=2)+'\n')
    return ordered

def mix(config):
    clips=verify(config);args=[binary('ffmpeg'),'-y','-v','error']
    for c in clips:args+=['-i',PUBLIC/'processed'/f"{c['id']}.wav"]
    filters=[]
    for i,c in enumerate(clips):
        delay=round(c['startFrame']/30*1000)
        filters.append(f"[{i}:a]volume={c['volume']},adelay={delay}:all=1[a{i}]")
    inputs=''.join(f'[a{i}]' for i in range(len(clips)))
    filters.append(f'{inputs}amix=inputs={len(clips)}:normalize=0,apad,atrim=duration={total_frames()/30}[out]')
    OUT.mkdir(exist_ok=True)
    run(args+['-filter_complex',';'.join(filters),'-map','[out]','-ar','48000','-c:a','pcm_s16le',OUT/'neuroai-ai-voice-track.wav'])
    print('Mixed AI-only timeline:',OUT/'neuroai-ai-voice-track.wav')

def main():
    parser=argparse.ArgumentParser();parser.add_argument('stage',choices=['generate','process','verify','mix','build','test']);parser.add_argument('--force',action='store_true');args=parser.parse_args()
    load_env();config=json.loads(CONFIG.read_text())
    # Never leave a stale ready flag after failed regeneration / processing.
    if args.stage in ('generate','process','build'):GENERATED.write_text('{"ready":false,"clips":[]}\n')
    if args.stage in ('generate','build'):generate(config,args.force)
    if args.stage in ('process','build'):process(config)
    if args.stage in ('verify','build'):verify(config)
    if args.stage in ('mix','build'):mix(config)
    if args.stage=='test':
        import tempfile,struct
        with tempfile.TemporaryDirectory() as folder:
            src=Path(folder)/'test-tone.wav';dst=Path(folder)/'processed-test-tone.wav'
            with wave.open(str(src),'wb') as w:
                w.setparams((1,2,24000,24000,'NONE','not compressed'))
                w.writeframes(b''.join(struct.pack('<h',int(6000*math.sin(2*math.pi*180*i/24000))) for i in range(24000)))
            info=process_one(src,dst,config['processing'])
            assert info['sampleRate']==48000 and info['channels']==2 and 0.9<info['duration']<1.2
            print('FFmpeg processing smoke test passed using a temporary test tone; no fake speech assets created.')
if __name__=='__main__':
    try:main()
    except (RuntimeError,subprocess.CalledProcessError,urllib.error.URLError) as e:
        print(f'AI voice pipeline stopped: {e}',file=sys.stderr);sys.exit(1)
