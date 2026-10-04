import {useState,useEffect} from 'react';
import {Sparkles,LoaderCircle} from 'lucide-react';
import {ScientificCard,DemoBadge} from './ScientificCard';
import {Select} from './Select';
import {modelService} from '../services/api/modelService';
import {useResearchData} from '../hooks/useResearchData';
import type {ModelName,ModelResult} from '../types/scientific';
export const modelNames:ModelName[]=['Logistic Regression','Linear Discriminant Analysis (LDA)','Support Vector Machine (SVM)'];
export function ModelPredictionCard(){const {selection}=useResearchData();const [model,setModel]=useState<ModelName>(modelNames[2]);const [result,setResult]=useState<ModelResult|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{setResult(null)},[selection]);
 async function predict(){setBusy(true);setError('');try{setResult(await modelService.predict(model,selection));}catch(e){setError(e instanceof Error?e.message:'Prediction failed')}finally{setBusy(false)}}
 return <ScientificCard title="Model Prediction" subtitle="Illustrative output · no model execution" controls={<DemoBadge/>}><div className="prediction-content"><Select label="Model" value={model} onChange={v=>{setModel(v as ModelName);setResult(null)}}>{modelNames.map(m=><option key={m}>{m}</option>)}</Select><button className="button primary" disabled={busy} onClick={()=>void predict()}>{busy?<LoaderCircle size={15} className="spin"/>:<Sparkles size={15}/>} {busy?'Preparing preview…':'Run Prediction'}</button><div className="prediction-result" aria-live="polite"><span className="eyebrow">PREDICTION RESULT · DEMO</span><h3>{result?(result.prediction==='right'?'Right':'Left')+' Hand Imagery':'Right Hand Imagery'}</h3><div className="confidence"><span>Confidence</span><strong>{Math.round((result?.confidence??.87)*100)}%</strong></div><progress value={(result?.confidence??.87)*100} max="100" aria-label="Demonstration confidence"/><small>{result?'Demo prediction returned. This is not a research finding.':'Example output. Run to preview the service interaction.'}</small></div>{error&&<p className="error" role="alert">{error}</p>}</div></ScientificCard>}
