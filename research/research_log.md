# Research log

Copy this template for each experiment; distinguish observations from interpretations.

Experiment ID:

Date:

Research question:

Hypothesis:

Dataset:

Subjects:

Preprocessing:

Model:

Parameters:

Validation method:

Results:

Unexpected observations:

Interpretation:

Limitations:

Next experiment:

## Completed entry — Phase 1 verification

Experiment ID: experiment_001
Date: 2026-10-03
Research question: Can one subject's left/right imagery EEG be retrieved, inspected and preprocessed reliably?
Hypothesis: The scientific classification hypotheses remain untested in this milestone.
Dataset: PhysioNet EEGMMIDB v1.0.0
Subjects: 1
Preprocessing: Named channels, template montage, recorded reference, 8–30 Hz zero-phase FIR, 1–4 s cue-aligned epochs, no baseline or automatic artifact rejection.
Model: None fitted.
Parameters: experiments/experiment_001/config.json
Validation method: Executed code cells from notebooks 01 and 02 headlessly on actual EDFs; four offline tests passed; six notebooks validated; dependency check passed; condition-PSD figure inspected visually.
Results: 64 EEG channels; 160 Hz sampling; 45 candidate and retained epochs (23 left, 22 right); zero dropped epochs; task annotations 4.1 s. Per-run counts saved in results/tables/phase1_epoch_counts.csv.
Unexpected observations: Sandbox network restrictions required approved downloads. Corrected an epoch PSD compatibility issue during verification. Current MNE renamed the standard_1005 montage; loader supports the new name with fallback. Headless plotting emits expected non-interactive-display warnings while saving figures.
Interpretation: Retrieval, label mapping, filtering, epoching and descriptive plots execute successfully. No evidence about above-chance classification or feature importance is established.
Limitations: Automated execution does not replace manual artifact review; no trials dropped does not mean clean EEG. One subject and an exploratory processing protocol do not support population inference.
Next experiment: Review raw/epoch plots and record artifact decisions; prespecify run-aware baseline evaluation before implementing notebooks 03–06.
