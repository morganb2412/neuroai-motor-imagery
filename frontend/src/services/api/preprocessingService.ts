import {API_MODE,request,demoResponse} from './client';
import type {PreprocessingConfig,ResearchSelection} from '../../types/scientific';
export const preprocessingService={preview:(selection:ResearchSelection,config:PreprocessingConfig)=>
 API_MODE==='mock'?demoResponse({message:'Configuration preview saved. No EEG was processed.',executed:false}):
 request<{message:string;executed:boolean}>('/preprocess',{method:'POST',body:JSON.stringify({selection,config})})};
