import config from './aiVoice.config.json';
import generated from './aiVoice.generated.json';
export type AIClip={id:string;text:string;rawFile:string;processedFile:string;startFrame:number;volume:number;durationInFrames:number};
export const aiVoiceReady=generated.ready&&JSON.stringify((generated as unknown as {config:unknown}).config)===JSON.stringify(config);
export const aiVoice:AIClip[]=config.clips.map(clip=>({...clip,rawFile:`/audio/ai/raw/${clip.id}.wav`,processedFile:`/audio/ai/processed/${clip.id}.wav`,durationInFrames:(generated.clips as {id:string;durationInFrames:number}[]).find(c=>c.id===clip.id)?.durationInFrames??0}));
export const humanSpeechWindows:{startFrame:number;endFrame:number}[]=[];
// Fill these with measured HUMAN speech intervals after recording. Unlisted intervals are gaps.
