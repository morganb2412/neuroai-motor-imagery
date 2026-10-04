import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from 'recharts';
import type {FilteredSignal} from '../types/scientific';
import {BLUE,PURPLE,GRID,axisStyle,tooltipStyle} from './theme';
export function FilteredEEGChart({data,condition}:{data:FilteredSignal[];condition:string}){return <div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{top:8,right:8,left:0,bottom:16}}>
 <CartesianGrid stroke={GRID} vertical={false}/><XAxis dataKey="time" tick={axisStyle} type="number" domain={[0,4]} tickCount={5} tickLine={false} axisLine={false} label={{value:'Time (seconds)',position:'insideBottom',offset:-12,...axisStyle}}/><YAxis tick={axisStyle} width={42} tickLine={false} axisLine={false} domain={[-15,15]} label={{value:'µV',angle:-90,position:'insideLeft',...axisStyle}}/>
 <Tooltip contentStyle={tooltipStyle} labelFormatter={v=>`${Number(v).toFixed(2)} s`} formatter={v=>`${Number(v).toFixed(1)} µV`}/>
 {condition!=='right'&&<Line dataKey="left" name="Left Hand (MI)" stroke={BLUE} strokeWidth={1.1} dot={false} isAnimationActive={false}/>}
 {condition!=='left'&&<Line dataKey="right" name="Right Hand (MI)" stroke={PURPLE} strokeWidth={1.1} dot={false} isAnimationActive={false}/>}
 </LineChart></ResponsiveContainer></div>}
export function ConditionLegend(){return <div className="condition-legend"><span><i className="blue"/>Left Hand (MI)</span><span><i className="purple"/>Right Hand (MI)</span></div>}
