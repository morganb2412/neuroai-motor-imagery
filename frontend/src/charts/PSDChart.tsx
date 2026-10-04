import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ReferenceArea,ResponsiveContainer} from 'recharts';
import type {PSDResult} from '../types/scientific';
import {BLUE,PURPLE,GRID,axisStyle,tooltipStyle} from './theme';
export function PSDChart({data,condition}:{data:PSDResult[];condition:string}){return <div className="chart-frame psd-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{top:25,right:12,left:0,bottom:18}}>
 <CartesianGrid stroke={GRID} vertical={false}/><XAxis dataKey="frequency" type="number" domain={[0,50]} tick={axisStyle} tickLine={false} axisLine={false} label={{value:'Frequency (Hz)',position:'insideBottom',offset:-12,...axisStyle}}/><YAxis tick={axisStyle} width={44} tickLine={false} axisLine={false} label={{value:'µV²/Hz',position:'insideLeft',angle:-90,...axisStyle}}/>
 <ReferenceArea x1={8} x2={12} fill={BLUE} fillOpacity={.06} label={{value:'Mu',position:'insideTop',fill:'#6c85a6',fontSize:11}}/><ReferenceArea x1={13} x2={30} fill={PURPLE} fillOpacity={.045} label={{value:'Beta',position:'insideTop',fill:'#8a7f9a',fontSize:11}}/>
 <Tooltip contentStyle={tooltipStyle} labelFormatter={v=>`${v} Hz`} formatter={v=>`${Number(v).toFixed(2)} µV²/Hz`}/>
 {condition!=='right'&&<Area dataKey="left" name="Left Hand MI" stroke={BLUE} fill={BLUE} fillOpacity={.035} strokeWidth={2} dot={false} isAnimationActive={false}/>}
 {condition!=='left'&&<Area dataKey="right" name="Right Hand MI" stroke={PURPLE} fill={PURPLE} fillOpacity={.03} strokeWidth={2} dot={false} isAnimationActive={false}/>}
 </AreaChart></ResponsiveContainer></div>}
