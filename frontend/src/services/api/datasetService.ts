import {API_MODE,request,demoResponse} from './client';
import {mockDataset,mockSubjects} from '../../data/mock/mockResearch';
import type {Dataset, Subject} from '../../types/scientific';
export const datasetService={
 list:()=>API_MODE==='mock'?demoResponse([mockDataset]):request<Dataset[]>('/datasets'),
 subjects:(dataset:string)=>API_MODE==='mock'?demoResponse(mockSubjects):request<Subject[]>(`/subjects?dataset=${encodeURIComponent(dataset)}`)
};
