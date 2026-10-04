"""Offline integration tests use temporary tones, never pretend they are TTS."""
import importlib.util,json,math,struct,tempfile,unittest,wave
from pathlib import Path
spec=importlib.util.spec_from_file_location('pipeline',Path(__file__).with_name('ai-voice.py'))
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
class AudioPipelineTests(unittest.TestCase):
 def test_process_mix_and_guards(self):
  with tempfile.TemporaryDirectory() as folder:
   old=(p.PUBLIC,p.OUT,p.GENERATED)
   try:
    root=Path(folder);p.PUBLIC=root/'audio';p.OUT=root/'out';p.GENERATED=root/'generated.json'
    config=json.loads(p.CONFIG.read_text())
    for c in config['clips']:
     dest=p.PUBLIC/'raw'/f"{c['id']}.wav";dest.parent.mkdir(parents=True,exist_ok=True)
     with wave.open(str(dest),'wb') as w:
      w.setparams((1,2,24000,0,'NONE','not compressed'))
      w.writeframes(b''.join(struct.pack('<h',int(4000*math.sin(i*.047))) for i in range(6000)))
    p.process(config);p.mix(config)
    self.assertTrue(json.loads(p.GENERATED.read_text())['ready'])
    self.assertEqual(len(json.loads(p.GENERATED.read_text())['clips']),11)
    self.assertEqual(p.wav_info(p.OUT/'neuroai-ai-voice-track.wav')['duration'],60)
    config['clips'][1]['startFrame']=0
    with self.assertRaisesRegex(RuntimeError,'overlap'):p.verify(config)
    config['clips'][1]['startFrame']=120;config['clips'][-1]['startFrame']=1799
    with self.assertRaisesRegex(RuntimeError,'beyond'):p.verify(config)
   finally:p.PUBLIC,p.OUT,p.GENERATED=old
if __name__=='__main__':unittest.main()
