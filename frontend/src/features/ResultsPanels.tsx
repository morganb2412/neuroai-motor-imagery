import {useEffect,useState} from 'react';
import {ScientificCard,DemoBadge,EmptyState} from '../components/ScientificCard';
import {MetricsTable} from '../components/MetricsTable';
import {ConfusionMatrix} from '../components/ConfusionMatrix';
import {ModelComparisonChart} from '../charts/ModelComparisonChart';
import {ROCChart} from '../charts/ROCChart';
import {modelService,type ResultsResponse} from '../services/api/modelService';
export function ResultsPanels({roc=false}:{roc?:boolean}){const [results,setResults]=useState<ResultsResponse|null>(null),[error,setError]=useState('');useEffect(()=>{modelService.results('DEMO-001').then(setResults).catch(e=>setError(String(e)))},[]);
 if(error)return <p role="alert" className="error">{error}</p>;
 if(!results)return <div className="skeleton" role="status" aria-label="Loading demo metrics"/>;
 return <><ScientificCard title="Classification Metrics" subtitle="Illustrative values · not measured performance" controls={<DemoBadge/>}><div className="metrics-layout"><MetricsTable metrics={results.metrics}/><ConfusionMatrix values={results.metrics.confusion}/></div><p className="card-footnote">Display metrics and confusion counts are independent mock fixtures; they are not an internally derived evaluation.</p></ScientificCard><ScientificCard title="Model Comparison" subtitle="Demo baselines · accuracy and F1"><ModelComparisonChart data={results.comparison}/></ScientificCard>{roc&&<ScientificCard title="Receiver Operating Characteristic" subtitle="Illustrative curve · no held-out predictions"><ROCChart data={results.roc}/></ScientificCard>}</>}
