"""Create temporary test tone for the explicitly labeled integration-test composition."""
import wave,math,struct
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'public/audio/.validation-ai/test.wav'
p.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(p),'wb') as w:
 w.setparams((2,2,48000,0,'NONE','not compressed'))
 w.writeframes(b''.join(struct.pack('<hh',int(5000*math.sin(i*.05)),int(5000*math.sin(i*.05))) for i in range(48000)))
