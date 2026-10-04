import {Audio,Sequence,staticFile} from 'remotion';
import {aiVoice,aiVoiceReady,humanSpeechWindows} from '../data/aiVoice';
import {AIVoiceClip} from './AIVoiceClip';
export type VoiceProps={enableAIVoice?:boolean;aiVoiceVariant?:'raw'|'processed';aiVoiceVolume?:number;humanVoiceVolume?:number};
export const VoiceTrack=({voiceoverSrc,voiceoverStartFrame,enableAIVoice=false,aiVoiceVariant='processed',aiVoiceVolume=1,humanVoiceVolume=1}:VoiceProps&{voiceoverSrc:string|null;voiceoverStartFrame:number})=>{
 if(enableAIVoice&&!aiVoiceReady)throw new Error('AI audio is not ready. Run npm run ai:build with OPENAI_API_KEY, or provide raw WAVs and run npm run ai:process.');
 return <>{voiceoverSrc&&<Sequence from={voiceoverStartFrame} name="Moe / primary narration"><Audio src={staticFile(voiceoverSrc)} volume={humanVoiceVolume}/></Sequence>}{enableAIVoice&&<div style={{position:'absolute',left:84,top:263,fontFamily:'Arial,sans-serif',fontSize:18,letterSpacing:1,color:'#71849c'}}>SYNTHETIC AI VOICE · DEMO WORKFLOW</div>}{enableAIVoice&&aiVoice.map(clip=><AIVoiceClip key={clip.id} clip={clip} variant={aiVoiceVariant} gain={aiVoiceVolume} humanPresent={Boolean(voiceoverSrc)} humanWindows={humanSpeechWindows}/>)}</>;
};
