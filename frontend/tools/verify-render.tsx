// Route render smoke check. Does not claim browser layout or scientific validation.
import React from 'react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {ResearchProvider} from '../src/hooks/useResearchData';
import Explore from '../src/pages/ExplorePage';
import Data from '../src/pages/DataPage';
import Preprocess from '../src/pages/PreprocessPage';
import Models from '../src/pages/ModelsPage';
import Visualizations from '../src/pages/VisualizationsPage';
import Results from '../src/pages/ResultsPage';
import Research from '../src/pages/ResearchPage';
import Export from '../src/pages/ExportPage';
const pages=[['explore',Explore,'NeuroAI Research Platform'],['data',Data,'Dataset browser'],['preprocess',Preprocess,'Preprocessing'],['models',Models,'Model training'],['visualizations',Visualizations,'Neural patterns'],['results',Results,'Results &amp; metrics'],['research',Research,'Research &amp; methodology'],['export',Export,'Export workspace']] as const;
for(const [route,Page,title] of pages){const html=renderToString(<MemoryRouter initialEntries={['/'+route]}><ResearchProvider><Page/></ResearchProvider></MemoryRouter>);if(!html.includes(title))throw new Error(`Missing expected title for ${route}`);console.log(`PASS /${route} (${html.length} rendered characters)`)}

const {eegService}=await import('../src/services/api/eegService');
const {modelService}=await import('../src/services/api/modelService');
const {preprocessingService}=await import('../src/services/api/preprocessingService');
const selection={dataset:'eegmmidb',subject:1,run:4,condition:'left-right' as const};
const first=await eegService.load(selection);
const next=await eegService.load({...selection,subject:2,run:8});
if(first.raw.length!==801 || first.raw[20].C3===next.raw[20].C3)throw new Error('EEG selection must update deterministic fixtures');
const prediction=await modelService.predict('Support Vector Machine (SVM)',selection);
if(!prediction.demo || prediction.confidence!==.87)throw new Error('Prediction demo provenance missing');
const training=await modelService.train('Logistic Regression',3,42);
const processing=await preprocessingService.preview(selection,{low:8,high:30,start:1,end:4,baseline:'None',artifacts:'Manual review'});
if(training.executed || processing.executed)throw new Error('Mock actions must not claim scientific execution');
console.log('PASS mock service contracts, selection variation and demo execution flags');
