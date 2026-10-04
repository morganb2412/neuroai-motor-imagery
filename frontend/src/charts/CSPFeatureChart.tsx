import {BarChart,Bar,Cell,XAxis,YAxis,CartesianGrid,Tooltip,ReferenceLine,ResponsiveContainer} from 'recharts';
import type {CSPFeature} from '../types/scientific';
import {BLUE,PURPLE,GRID,axisStyle,tooltipStyle} from './theme';
export function CSPFeatureChart({data,component}:{data:CSPFeature[];component:number}){const values=data.map((v,i)=>({...v,weight:component===1?v.weight:v.weight*Math.cos(i+component)}));return <div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><BarChart data={values} margin={{top:10,right:10,left:0,bottom:5}}>
 <CartesianGrid stroke={GRID} vertical={false}/><XAxis dataKey="channel" tick={axisStyle} tickLine={false} axisLine={false}/><YAxis tick={axisStyle} tickLine={false} axisLine={false} width={44} label={{value:'Weight',angle:-90,position:'insideLeft',...axisStyle}}/><ReferenceLine y={0} stroke="#c4cfde"/><Tooltip contentStyle={tooltipStyle} formatter={v=>Number(v).toFixed(3)}/><Bar dataKey="weight" name="Pattern weight" barSize={25} radius={[3,3,0,0]} isAnimationActive={false}>{values.map(v=><Cell key={v.channel} fill={v.weight>=0?BLUE:PURPLE}/>)}</Bar>
 </BarChart></ResponsiveContainer></div>}
