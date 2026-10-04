export const FPS=30;
// Change seconds here after recording. Scene boundaries and composition duration follow automatically.
export const sceneTiming = [
  {id:'intro',seconds:4},{id:'bridge',seconds:5},{id:'question',seconds:6},
  {id:'eeg',seconds:5},{id:'preprocess',seconds:8},{id:'imagery',seconds:6},
  {id:'models',seconds:5},{id:'accuracy',seconds:7},{id:'explain',seconds:6},
  {id:'platform',seconds:5},{id:'outro',seconds:3},
] as const;
export const durationInFrames=sceneTiming.reduce((sum,s)=>sum+Math.round(s.seconds*FPS),0);
