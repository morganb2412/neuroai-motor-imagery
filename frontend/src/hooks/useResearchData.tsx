import {createContext,useContext,useEffect,useState,useCallback,type ReactNode} from 'react';
import {eegService} from '../services/api/eegService';
import type {DashboardData,ResearchSelection} from '../types/scientific';
const initial:ResearchSelection={dataset:'eegmmidb',subject:1,run:4,condition:'left-right'};
interface ResearchContext {selection:ResearchSelection;data:DashboardData|null;loading:boolean;error:string;load:(s:ResearchSelection)=>Promise<boolean>}
const Context=createContext<ResearchContext|null>(null);
export function ResearchProvider({children}:{children:ReactNode}){
 const [selection,setSelection]=useState(initial),[data,setData]=useState<DashboardData|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const load=useCallback(async(s:ResearchSelection)=>{setLoading(true);setError('');try{const next=await eegService.load(s);setData(next);setSelection(s);return true;}catch(e){setError(e instanceof Error?e.message:'Unable to load data.');return false;}finally{setLoading(false);}},[]);
 useEffect(()=>{void load(initial)},[load]);
 useEffect(()=>{
 const context=(document as Document & {modelContext?:{registerTool:(tool:object,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
 if(!context?.registerTool)return;
 const lifecycle=new AbortController();
 try{void Promise.resolve(context.registerTool({name:'load_neuroai_preview',title:'Load EEG preview',description:'Load the selected subject/run into the visible research workspace. In mock mode this loads synthetic demo data, never real research results.',inputSchema:{type:'object',properties:{subject:{type:'integer',minimum:1,maximum:8},run:{type:'integer',enum:[4,8,12]},condition:{type:'string',enum:['left-right','left','right']}},required:['subject','run','condition'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async(input:unknown)=>{
 if(!input||typeof input!=='object')throw new Error('Supply a selection object.');
 const value=input as Record<string,unknown>;
 if(Object.keys(value).some(k=>!['subject','run','condition'].includes(k))||!Number.isInteger(value.subject)||Number(value.subject)<1||Number(value.subject)>8||![4,8,12].includes(Number(value.run))||!['left-right','left','right'].includes(String(value.condition)))throw new Error('Invalid preview selection.');
 const next:ResearchSelection={dataset:'eegmmidb',subject:Number(value.subject),run:Number(value.run),condition:value.condition as ResearchSelection['condition']};
 const ok=await load(next);if(!ok)throw new Error('EEG preview could not be loaded.');return {loaded:true,selection:next};
 }},{signal:lifecycle.signal})).catch(()=>{});}catch{/* Unsupported or rejected registry: ordinary UI remains available. */}
 return()=>lifecycle.abort();
 },[load]);
 return <Context.Provider value={{selection,data,loading,error,load}}>{children}</Context.Provider>;
}
export function useResearchData(){const context=useContext(Context);if(!context)throw new Error('ResearchProvider required');return context;}
