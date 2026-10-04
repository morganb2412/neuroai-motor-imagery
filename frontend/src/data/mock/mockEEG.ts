// UI DEMONSTRATION ONLY. Deterministic oscillatory mixtures, never recorded EEG.
import type { EEGSignal, FilteredSignal, ResearchSelection } from '../../types/scientific';
export const channels = ['C3', 'Cz', 'C4', 'P3', 'P4'] as const;
const rhythmTexture = (t:number, phase:number) => Array.from({length:14},(_,n)=>
 Math.sin(2*Math.PI*(8.4+n*1.55)*t+phase+(n*n*.73))/(1+n*.15)).reduce((a,b)=>a+b,0)*.65;
const wave = (t: number, phase: number, seed: number) =>
  (8 + 2 * Math.sin(2 * Math.PI * .65 * t + phase)) * Math.sin(2 * Math.PI * (10 + seed * .03) * t + phase)
  + 3 * Math.sin(2 * Math.PI * 21 * t + phase * 2) + 4 * Math.sin(2 * Math.PI * 1.2 * t + phase)
  + 1.3 * Math.sin(2 * Math.PI * 37 * t + .7) + rhythmTexture(t,phase);
export function makeRawEEG(selection: ResearchSelection): EEGSignal[] {
  const seed = selection.subject + selection.run;
  return Array.from({length:801}, (_,i) => {const time=i/160; return {time,
    C3:wave(time,.1,seed), Cz:wave(time,.8,seed), C4:wave(time,1.4,seed),
    P3:wave(time,2.2,seed)*.8, P4:wave(time,2.9,seed)*.85};});
}
export function makeFilteredEEG(selection: ResearchSelection, channel: string): FilteredSignal[] {
  const phase = channels.indexOf(channel as typeof channels[number]) * .45 + selection.subject * .1;
  return Array.from({length:641},(_,i)=>{ const time=i/160; const envelope=1+.2*Math.sin(time*3)+.12*Math.sin(time*5.7+phase);
    return {time,left:envelope*(7*Math.sin(2*Math.PI*10*time+phase)+2*Math.sin(2*Math.PI*22*time)+rhythmTexture(time,phase)),
      right:envelope*(8*Math.sin(2*Math.PI*11*time+phase+1)+2.5*Math.sin(2*Math.PI*20*time+.3)+rhythmTexture(time,phase+1))};});
}
