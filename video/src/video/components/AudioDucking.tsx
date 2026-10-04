export type SpeechWindow={startFrame:number;endFrame:number};
export const duckingGain=(frame:number,windows:SpeechWindow[],duckTo=.22,rampFrames=5)=>windows.reduce((gain,w)=>{
 const distance=frame<w.startFrame?w.startFrame-frame:frame>w.endFrame?frame-w.endFrame:0;
 return Math.min(gain,duckTo+(1-duckTo)*Math.min(1,distance/rampFrames));
},1);
