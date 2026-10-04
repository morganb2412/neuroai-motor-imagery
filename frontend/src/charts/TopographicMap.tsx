import {useId,useMemo} from 'react';
import type {TopographyPoint,MotorImageryCondition} from '../types/scientific';
const palette=['#e7eef9','#bfd2ef','#8faedf','#638ac8','#6e77bb','#9466a9','#bd7699'];
export function TopographicMap({points,condition,band='mu'}:{points:TopographyPoint[];condition:MotorImageryCondition;band?:string}){
 const id=useId().replace(/:/g,'');
 const cells=useMemo(()=>{const result=[];const step=.065;for(let y=-1;y<=1;y+=step)for(let x=-1;x<=1;x+=step){if(x*x+y*y>.96)continue;
 let numerator=0,denominator=0;for(const p of points){const distance=(x-p.x)**2+(y-p.y)**2;const weight=1/(distance+.02)**1.5;numerator+=p[condition]*weight;denominator+=weight;}
 const value=numerator/denominator*(band==='beta'?.72:1);const color=palette[Math.min(6,Math.max(0,Math.floor((value-2)/8*7)))];result.push({x,y,color});}return result},[points,condition,band]);
 return <figure className="topography"><svg viewBox="0 0 240 240" role="img" aria-label={`${condition} hand imagery synthetic scalp power map`}><defs><clipPath id={id}><circle cx="120" cy="116" r="89"/></clipPath><filter id={`${id}blur`}><feGaussianBlur stdDeviation="3"/></filter></defs>
 <g clipPath={`url(#${id})`} filter={`url(#${id}blur)`}>{cells.map((c,i)=><rect key={i} x={120+c.x*89-4} y={116+c.y*89-4} width="10" height="10" fill={c.color}/>)}</g>
 <circle cx="120" cy="116" r="89" fill="none" stroke="#637891" strokeWidth="1.4"/><path d="M109 28l11-13 11 13 M31 100C17 95 17 134 31 134 M209 100C223 95 223 134 209 134" fill="none" stroke="#637891" strokeWidth="1.4"/>
 {points.map(p=><g key={p.channel}><circle cx={120+p.x*89} cy={116+p.y*89} r="2.3" fill="#344966" stroke="#fff" strokeWidth=".6"/><text x={120+p.x*89} y={109+p.y*89} textAnchor="middle" fontSize="7.5" fill="#273d58">{p.channel}</text></g>)}</svg><figcaption>{condition==='left'?'Left':'Right'} Hand Imagery</figcaption></figure>
}
export function PowerScale(){return <div className="power-scale"><span>2</span><div/><span>10 µV²</span><small>Illustrative band power</small></div>}
