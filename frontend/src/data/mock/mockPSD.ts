import type { PSDResult } from '../../types/scientific';
// Illustrative spectra in µV²/Hz; not an inference about laterality.
export function makePSD(seed:number): PSDResult[] { return Array.from({length:101},(_,i)=>{
 const frequency=i/2; const base=3/(1+frequency*.7);
 return {frequency,left:base+5*Math.exp(-((frequency-10.3)**2)/4)+1.5*Math.exp(-((frequency-21)**2)/22),
 right:base+4.3*Math.exp(-((frequency-11)**2)/4)+1.9*Math.exp(-((frequency-22)**2)/22)+.03*seed};}); }
