export type MotorImageryCondition = 'left' | 'right';
export type ModelName = 'Logistic Regression' | 'Linear Discriminant Analysis (LDA)' | 'Support Vector Machine (SVM)';
export interface ResearchSelection { dataset: string; subject: number; run: number; condition: 'left-right' | 'left' | 'right' }
export interface EEGChannel { name: string; region: string }
export interface EEGSignal { time: number; C3: number; Cz: number; C4: number; P3: number; P4: number }
export interface FilteredSignal { time: number; left: number; right: number }
export interface Epoch { time: number; trial1: number; trial2: number; trial3: number; trial4: number }
export interface EventMarker { time: number; condition: MotorImageryCondition }
export interface PSDResult { frequency: number; left: number; right: number }
export interface ClassificationMetrics { accuracy: number; balancedAccuracy: number; precision: number; recall: number; f1: number; rocAuc: number; confusion: number[][] }
export interface ModelResult { model: ModelName; prediction: MotorImageryCondition; confidence: number; demo: boolean }
export interface CSPFeature { channel: string; weight: number }
export interface TopographyPoint { channel: string; x: number; y: number; left: number; right: number }
export interface Dataset { id: string; name: string; subjects: number; runs: number; samplingRate: number; channels: number; source: string }
export interface Subject { id: number; availableRuns: string; trials: number; status: string }
export interface PreprocessingConfig { low: number; high: number; start: number; end: number; baseline: string; artifacts: string }
export interface Experiment { id: string; date: string; researchQuestion: string; hypothesis: string; dataset: string; subjects: string; preprocessing: string; model: string; parameters: string; validationMethod: string; results: string; interpretation: string; limitations: string; nextExperiment: string; demo: boolean }
export interface DashboardData { raw: EEGSignal[]; filtered: Record<string, FilteredSignal[]>; epochs: Record<MotorImageryCondition, Epoch[]>; events: EventMarker[]; psd: PSDResult[]; topography: TopographyPoint[]; csp: CSPFeature[] }
