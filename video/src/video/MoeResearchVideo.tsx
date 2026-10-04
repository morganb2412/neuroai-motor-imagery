import {AbsoluteFill,Sequence} from 'remotion';
import {sceneTiming,FPS} from './data/timing';
import {IntroScene,ScienceAIBridgeScene,ResearchQuestionScene,EEGScene,PreprocessingScene,MotorImageryScene,MachineLearningScene,AccuracyScene,ExplainabilityScene,PlatformScene,OutroScene} from './scenes/Scenes';
import {VoiceTrack,type VoiceProps} from './components/VoiceTrack';
import {Caption} from './components/Caption';
export type VideoProps=VoiceProps&{showCaptions:boolean;voiceoverSrc:string|null;voiceoverStartFrame:number;showSafeGuides:boolean};
const scenes=[IntroScene,ScienceAIBridgeScene,ResearchQuestionScene,EEGScene,PreprocessingScene,MotorImageryScene,MachineLearningScene,AccuracyScene,ExplainabilityScene,PlatformScene,OutroScene];
export const MoeResearchVideo=({showCaptions,voiceoverSrc,voiceoverStartFrame,showSafeGuides,...voiceProps}:VideoProps)=>{let from=0;return <AbsoluteFill>{sceneTiming.map((s,i)=>{const start=from;const duration=Math.round(s.seconds*FPS);from+=duration;const Scene=scenes[i];return <Sequence key={s.id} from={start} durationInFrames={duration} name={s.id}><Scene/></Sequence>;})}<VoiceTrack voiceoverSrc={voiceoverSrc} voiceoverStartFrame={voiceoverStartFrame} {...voiceProps}/>{showCaptions&&<Caption/>}{showSafeGuides&&<div style={{position:'absolute',left:84,top:190,width:816,height:1340,border:'3px dashed #ed567a',pointerEvents:'none'}}/>}</AbsoluteFill>;};
