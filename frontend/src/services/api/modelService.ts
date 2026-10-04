import {API_MODE,request,demoResponse} from './client';
import {mockMetrics,mockComparison,mockROC} from '../../data/mock/mockMetrics';
import type {ModelName,ModelResult,ClassificationMetrics,ResearchSelection} from '../../types/scientific';
export interface ResultsResponse {metrics:ClassificationMetrics;comparison:typeof mockComparison;roc:typeof mockROC;demo:boolean}
export const modelService={
 predict:(model:ModelName,selection:ResearchSelection):Promise<ModelResult>=>API_MODE==='mock'?
 demoResponse({model,prediction:'right',confidence:.87,demo:true}):request('/models/predict',{method:'POST',body:JSON.stringify({model,selection})}),
 train:(model:ModelName,folds:number,seed:number)=>API_MODE==='mock'?demoResponse({message:'Demo configuration recorded. No model was trained.',executed:false}):request<{message:string;executed:boolean}>('/models/train',{method:'POST',body:JSON.stringify({model,folds,seed})}),
 results:(id:string):Promise<ResultsResponse>=>API_MODE==='mock'?demoResponse({metrics:mockMetrics,comparison:mockComparison,roc:mockROC,demo:true}):request(`/results/${encodeURIComponent(id)}`)
};
