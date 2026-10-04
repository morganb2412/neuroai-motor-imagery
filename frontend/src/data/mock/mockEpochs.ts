// Synthetic cue-centered display epochs, distinct from backend 1–4 s analysis epochs.
import type { Epoch, EventMarker, MotorImageryCondition } from '../../types/scientific';
export function makeEpochs(condition: MotorImageryCondition, seed: number): Epoch[] {
 return Array.from({length:321},(_,i)=>{const time=-1+i/160;const scale=condition==='left'?8:9;
 const trial=(n:number)=>scale*(1-.25*Math.exp(-((time-.3)**2)/.15))*Math.sin(time*2*Math.PI*(9.5+n*.3)+n*.65+seed*.1)+2*Math.sin(time*2*Math.PI*23+n);
 return {time,trial1:trial(1),trial2:trial(2),trial3:trial(3),trial4:trial(4)};});
}
export const mockEvents: EventMarker[] = Array.from({length:7},(_,i)=>({time:4.2+i*8.3,condition:i%2?'left':'right'}));
