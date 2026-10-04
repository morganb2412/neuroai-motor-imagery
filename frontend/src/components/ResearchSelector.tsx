import {useState,useEffect} from 'react';
import {Database,LoaderCircle} from 'lucide-react';
import {useResearchData} from '../hooks/useResearchData';
import {Select} from './Select';
import type {ResearchSelection} from '../types/scientific';
export function ResearchSelector(){const {selection,load,loading}=useResearchData();const [draft,setDraft]=useState(selection);
 useEffect(()=>setDraft(selection),[selection]);
 const update=(key:keyof ResearchSelection,value:string|number)=>setDraft({...draft,[key]:value});
 return <form className="research-selector" onSubmit={e=>{e.preventDefault();void load(draft)}}>
 <Select label="Dataset" value={draft.dataset} onChange={v=>update('dataset',v)}><option value="eegmmidb">PhysioNet EEG Motor Movement/Imagery</option></Select>
 <Select label="Subject" value={draft.subject} onChange={v=>update('subject',Number(v))}>{Array.from({length:8},(_,i)=><option key={i} value={i+1}>Subject {String(i+1).padStart(2,'0')}</option>)}</Select>
 <Select label="Run" value={draft.run} onChange={v=>update('run',Number(v))}>{[4,8,12].map(r=><option key={r} value={r}>Run {r} — Motor Imagery</option>)}</Select>
 <Select label="Condition" value={draft.condition} onChange={v=>update('condition',v)}><option value="left-right">Left vs Right Hand Imagery</option><option value="left">Left Hand Imagery</option><option value="right">Right Hand Imagery</option></Select>
 <button className="button primary" disabled={loading}>{loading?<LoaderCircle size={16} className="spin"/>:<Database size={16}/>} {loading?'Loading…':'Load Data'}</button></form>}
