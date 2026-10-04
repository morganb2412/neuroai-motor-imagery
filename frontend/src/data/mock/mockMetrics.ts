import type { ClassificationMetrics } from '../../types/scientific';
// DEMO ONLY. Rounded display metrics; no real validation/training was performed.
export const mockMetrics: ClassificationMetrics = {accuracy:.82,balancedAccuracy:.81,precision:.83,recall:.80,f1:.81,rocAuc:.88,confusion:[[42,8],[10,40]]};
export const mockComparison = [{model:'Logistic Regression',accuracy:.76,f1:.75},{model:'LDA',accuracy:.79,f1:.78},{model:'SVM',accuracy:.82,f1:.81}];
export const mockROC = [{fpr:0,tpr:0},{fpr:.04,tpr:.36},{fpr:.10,tpr:.65},{fpr:.18,tpr:.80},{fpr:.35,tpr:.90},{fpr:.60,tpr:.96},{fpr:1,tpr:1}];
