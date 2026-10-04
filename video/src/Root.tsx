import {Composition} from 'remotion';
import {MoeResearchVideo, type VideoProps} from './video/MoeResearchVideo';
import {durationInFrames,FPS} from './video/data/timing';
export const Root=()=> <Composition id="MoeNeuroAIResearchTikTok" component={MoeResearchVideo} width={1080} height={1920} fps={FPS} durationInFrames={durationInFrames} defaultProps={{showCaptions:false,voiceoverSrc:null,voiceoverStartFrame:0,showSafeGuides:false,enableAIVoice:false,aiVoiceVariant:'processed',aiVoiceVolume:1,humanVoiceVolume:1} satisfies VideoProps}/>;
