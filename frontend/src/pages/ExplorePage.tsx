import {Activity,Layers,Radio,Clock3} from 'lucide-react';
import {ResearchHero} from '../components/ResearchHero';
import {ResearchSelector} from '../components/ResearchSelector';
import {ModelPredictionCard} from '../components/ModelPredictionCard';
import {RawPanel,FilteredPanel,EventsPanel,PSDPanel,TopographyPanel,CSPPanel,AnalysisLoading} from '../features/AnalysisPanels';
import {ResultsPanels} from '../features/ResultsPanels';
import {useResearchData} from '../hooks/useResearchData';
import {subjectLabel} from '../utils/format';
export default function ExplorePage(){const {selection,loading,error}=useResearchData();return <><ResearchHero/><ResearchSelector/><div className="signal-summary">{[[Activity,'Active preview',subjectLabel(selection.subject)], [Radio,'EEG channels','64 channels'],[Layers,'Imagery runs',`Run ${selection.run} selected`],[Clock3,'Sampling rate','160 Hz']].map(([Icon,label,value])=>{const C=Icon as typeof Activity;return <div key={String(label)}><C size={18}/><span>{String(label)}<strong>{String(value)}</strong></span></div>})}</div><div className="section-title"><h2>Signal exploration</h2><span>Left & right hand motor imagery</span></div>{error&&<div className="error" role="alert">{error}</div>}{loading?<AnalysisLoading/>:<div className="dashboard-grid"><RawPanel/><FilteredPanel/><EventsPanel/><PSDPanel/><TopographyPanel/><CSPPanel/><ModelPredictionCard/><ResultsPanels/></div>}</>}
