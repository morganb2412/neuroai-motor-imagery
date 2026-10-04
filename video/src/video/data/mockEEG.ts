// Deterministic SIMULATED graphics; not EDF signals, real PSD or measured scalp potentials.
export const channels=['C3','Cz','C4','P3','P4'];
export const signal=(x:number,c:number,t:number,clean=false)=>Math.sin(x*.091+t*2+c)*13+Math.sin(x*.037-t+c)*8+Math.sin(x*.173+t*.7+c)*5+(clean?0:Math.sin(x*.71+c+t)*6);
export const psd=Array.from({length:100},(_,i)=>({hz:i*.4,value:3+32*Math.exp(-(((i*.4-10.5)/2.4)**2))+13*Math.exp(-(((i*.4-21)/5)**2))}));
export const featureImportance=[{label:'CSP 1',value:.84},{label:'CSP 2',value:.66},{label:'Mu band',value:.52},{label:'Beta band',value:.35}];
