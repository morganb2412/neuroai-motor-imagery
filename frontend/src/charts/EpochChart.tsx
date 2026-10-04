import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ReferenceLine,ResponsiveContainer} from 'recharts';
import type {Epoch,MotorImageryCondition} from '../types/scientific';
import {BLUE,PURPLE,GRID,axisStyle,tooltipStyle} from './theme';
export function EpochChart({data,condition}:{data:Epoch[];condition:MotorImageryCondition}){return <div className="chart-frame epoch-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{top:5,right:8,left:0,bottom:18}}>
 <CartesianGrid stroke={GRID} vertical={false}/><XAxis type="number" dataKey="time" domain={[-1,1]} tick={axisStyle} axisLine={false} tickLine={false} label={{value:'Time relative to cue (seconds)',position:'insideBottom',offset:-12,...axisStyle}}/><YAxis tick={axisStyle} width={40} axisLine={false} tickLine={false} label={{value:'µV',position:'insideLeft',angle:-90,...axisStyle}}/>
 <ReferenceLine x={0} stroke="#a8b5c8" strokeDasharray="4 4"/><Tooltip contentStyle={tooltipStyle} labelFormatter={v=>`${Number(v).toFixed(2)} s`}/>
 {[1,2,3,4].map((n)=><Line key={n} dataKey={`trial${n}`} name={`Epoch ${n}`} stroke={condition==='left'?BLUE:PURPLE} strokeOpacity={.25+n*.16} strokeWidth={1.2} dot={false} isAnimationActive={false}/>)}
 </LineChart></ResponsiveContainer></div>}
