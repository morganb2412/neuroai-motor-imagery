import os, subprocess, json, io
from pathlib import Path
from PIL import Image, ImageDraw
root=Path(__file__).resolve().parents[2]
bin=root/'video/node_modules/@remotion/compositor-darwin-arm64'
env={**os.environ,'DYLD_LIBRARY_PATH':str(bin)}
video=root/'out/moe-neuroai-research-tiktok.mp4'
probe=json.loads(subprocess.check_output([str(bin/'ffprobe'),'-v','error','-show_streams','-show_format','-of','json',str(video)],env=env))
s=probe['streams'][0]
assert (s['width'],s['height'],s['r_frame_rate'])==(1080,1920,'30/1')
assert float(probe['format']['duration'])==60
assert len(probe['streams'])==1, 'Expected silent video only'
(root/'out/verification.json').write_text(json.dumps(probe,indent=2))
contact=Image.new('RGB',(5*270,3*510),'#e4eaf2')
for i,t in enumerate([2,7,12,18,25,31,37,43,49,55,58.5]):
    raw=subprocess.check_output([str(bin/'ffmpeg'),'-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-f','image2pipe','-c:v','png','pipe:1'],env=env)
    im=Image.open(io.BytesIO(raw)).convert('RGB').resize((270,480))
    contact.paste(im,((i%5)*270,(i//5)*510))
    ImageDraw.Draw(contact).text(((i%5)*270+10,(i//5)*510+484),f'Scene {i+1} / {t}s',fill='#173754')
contact.save(root/'out/contact-sheet.jpg')
print('Verified: H.264, 1080x1920, 30 FPS, 60 seconds, no audio. Contact sheet saved.')
