import type {ClassificationMetrics} from '../types/scientific';
const labels:[keyof ClassificationMetrics,string][]=[['accuracy','Accuracy'],['balancedAccuracy','Balanced Accuracy'],['precision','Precision'],['recall','Recall'],['f1','F1 Score'],['rocAuc','ROC-AUC']];
export function MetricsTable({metrics}:{metrics:ClassificationMetrics}){return <table className="metrics-table"><caption className="sr-only">Demonstration classification metrics</caption><tbody>{labels.map(([key,label])=><tr key={key}><th scope="row">{label}</th><td>{Number(metrics[key]).toFixed(2)}</td></tr>)}</tbody></table>}
