import {API_MODE,request,demoResponse} from './client';
import {mockExperiments} from '../../data/mock/mockResearch';
import type {Experiment} from '../../types/scientific';
const sessionExperiments=[...mockExperiments];
export const experimentService={
 list:()=>API_MODE==='mock'?demoResponse(sessionExperiments):request<Experiment[]>('/experiments'),
 create:(experiment:Experiment)=>{if(API_MODE==='live')return request<Experiment>('/experiments',{method:'POST',body:JSON.stringify(experiment)});
 sessionExperiments.unshift(experiment);return demoResponse(experiment);}
};
