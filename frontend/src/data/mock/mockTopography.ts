import type { TopographyPoint } from '../../types/scientific';
// Normalized illustration coordinates and invented power values, no source localization.
export const mockTopography: TopographyPoint[] = [
 ['Fp1',-.35,-.75],['Fp2',.35,-.75],['F3',-.4,-.4],['Fz',0,-.45],['F4',.4,-.4],
 ['C3',-.5,0],['Cz',0,0],['C4',.5,0],['T7',-.85,0],['T8',.85,0],
 ['P3',-.4,.4],['Pz',0,.45],['P4',.4,.4],['O1',-.3,.75],['O2',.3,.75]
].map(([channel,x,y])=>({channel:String(channel),x:Number(x),y:Number(y),
 left:3+7*Math.exp(-((Number(x)-.4)**2+Number(y)**2)/.35),
 right:3+7*Math.exp(-((Number(x)+.4)**2+Number(y)**2)/.35)}));
