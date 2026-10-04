import {PageHeader} from '../components/ScientificCard';
import {ResearchSelector} from '../components/ResearchSelector';
import {PSDPanel,TopographyPanel,CSPPanel,EventsPanel,AnalysisLoading} from '../features/AnalysisPanels';
import {useResearchData} from '../hooks/useResearchData';
export default function VisualizationsPage(){const {loading,error}=useResearchData();return <><PageHeader eyebrow="SCIENTIFIC VISUALIZATION" title="Neural patterns" description="Inspect oscillatory activity, cue-aligned epochs, scalp power, and illustrative spatial patterns."/><ResearchSelector/>{error&&<p className="error" role="alert">{error}</p>}{loading?<AnalysisLoading/>:<div className="two-column page-section"><PSDPanel/><EventsPanel/><section id="brain"><TopographyPanel/></section><section id="features"><CSPPanel/></section></div>}</>}
