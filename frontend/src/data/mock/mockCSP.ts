import type { CSPFeature } from '../../types/scientific';
// Illustrative CSP pattern weights, not validated feature importance.
export const mockCSP: CSPFeature[] = ['F3','Fz','F4','C3','Cz','C4','P3','Pz','P4'].map((channel,i)=>({channel,weight:[.12,.08,.15,.76,.43,-.67,.22,.1,-.18][i]}));
