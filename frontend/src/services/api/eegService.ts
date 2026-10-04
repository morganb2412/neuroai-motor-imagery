import {API_MODE,request,demoResponse} from './client';
import type {DashboardData, ResearchSelection} from '../../types/scientific';
import {channels,makeRawEEG,makeFilteredEEG} from '../../data/mock/mockEEG';
import {makeEpochs,mockEvents} from '../../data/mock/mockEpochs';
import {makePSD} from '../../data/mock/mockPSD';
import {mockCSP} from '../../data/mock/mockCSP';
import {mockTopography} from '../../data/mock/mockTopography';
export const eegService={load:(selection:ResearchSelection):Promise<DashboardData>=>{
 if(API_MODE==='live') return request(`/eeg/${selection.subject}/${selection.run}?condition=${selection.condition}`);
 return demoResponse({raw:makeRawEEG(selection),filtered:Object.fromEntries(channels.map(c=>[c,makeFilteredEEG(selection,c)])),
 epochs:{left:makeEpochs('left',selection.subject+selection.run),right:makeEpochs('right',selection.subject+selection.run)},
 events:mockEvents.map((e,i)=>({...e,condition:(i+selection.run/4)%2?'left' as const:'right' as const})),psd:makePSD(selection.subject+selection.run),topography:mockTopography.map(p=>({...p,left:p.left*(1+selection.subject*.01),right:p.right*(1+selection.subject*.01)})),csp:mockCSP.map(f=>({...f,weight:f.weight*(1+selection.subject*.005)}))});
}};
