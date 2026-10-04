import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from 'recharts';
import type {EEGSignal} from '../types/scientific';
import {axisStyle,GRID,tooltipStyle} from './theme';
const channelColors=['#3871a8','#5975b3','#687bba','#8191b9','#94a3bd'];
export function EEGTimeSeriesChart({data,channels,view}:{data:EEGSignal[];channels:string[];view:string}){
 const display=data.filter(d=>view==='5 seconds'||d.time<=2).map(row=>Object.fromEntries([['time',row.time],...channels.map((c,i)=>[c,row[c as keyof EEGSignal]+(channels.length-1-i)*36]) ]));
 const ticks=channels.map((_,i)=>i*36);
 return <div className="chart-frame raw-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={display} margin={{top:8,right:12,left:5,bottom:12}}>
 <CartesianGrid stroke={GRID} vertical={false}/><XAxis dataKey="time" type="number" domain={[0,view==='5 seconds'?5:2]} tick={axisStyle} tickCount={6} axisLine={false} tickLine={false} label={{value:'Time (seconds)',position:'insideBottom',offset:-8,...axisStyle}}/>
 <YAxis ticks={ticks} domain={[-22,(channels.length-1)*36+22]} tickFormatter={value=>channels[channels.length-1-Math.round(value/36)]||''} tick={axisStyle} axisLine={false} tickLine={false} width={38}/>
 <Tooltip contentStyle={tooltipStyle} labelFormatter={v=>`${Number(v).toFixed(2)} s`} formatter={(value,name)=>{const i=channels.indexOf(String(name));return [`${(Number(value)-(channels.length-1-i)*36).toFixed(1)} µV`,name]}}/>
 {channels.map((c,i)=><Line key={c} dataKey={c} stroke={channelColors[i]} strokeWidth={1} dot={false} isAnimationActive={false}/>)}
 </LineChart></ResponsiveContainer><span className="scale-label">Amplitude (µV) · vertically offset traces</span></div>;
}
