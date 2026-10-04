import {Audio,Sequence,staticFile} from 'remotion';
import type {AIClip} from '../data/aiVoice';
import {duckingGain,type SpeechWindow} from './AudioDucking';
export const AIVoiceClip=({clip,variant,gain,humanPresent,humanWindows}:{clip:AIClip;variant:'raw'|'processed';gain:number;humanPresent:boolean;humanWindows:SpeechWindow[]})=> <Sequence from={clip.startFrame} durationInFrames={clip.durationInFrames} name={`AI / ${clip.id}`}><Audio src={staticFile((variant==='raw'?clip.rawFile:clip.processedFile).replace(/^\//,''))} volume={f=>clip.volume*gain*(humanPresent?(humanWindows.length?duckingGain(f+clip.startFrame,humanWindows):.42):1)}/></Sequence>;
