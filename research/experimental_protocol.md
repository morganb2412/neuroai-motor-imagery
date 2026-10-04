# Experiment 001: one-subject inspection and preprocessing

## Source and subject
[PhysioNet EEGMMIDB v1.0.0](https://physionet.org/content/eegmmidb/1.0.0/),
DOI 10.13026/C28G6P, retrieved with MNE EEGBCI utilities. Observe its attribution
license and cite the dataset and original BCI2000 publication in future reports.
Subject 1 is selected in advance for a manageable engineering milestone, not because
of decoding performance. No claim of representativeness is made.

## Runs and labels
Runs 4, 8, 12 are unilateral fist motor imagery repetitions. T0=rest,
T1=imagined left fist, T2=imagined right fist. Explicit internal codes are left=1,
right=2. These meanings must not be reused for bilateral hand/foot or execution runs.
All three runs come from one subject; preserve run metadata and boundary annotations.

## Preprocessing and filtering
Keep original EDF files unchanged. Standardize channel labels; attach standard_1005
positions (the `colin27_1005` name in recent MNE, with the older name as fallback) as a template, not subject-specific electrode measurements. Retain the
recorded reference in Phase 1; no automatic rereferencing, ICA, interpolation or
amplitude rejection. Inspect raw traces, PSD and trial-drop reasons. Mark suspected
bad channels/segments only after review and document any change.

Apply fixed zero-phase FIR 8–30 Hz filtering to continuous data before epoching.
MNE handles run boundaries separately. This band focuses exploration on mu/alpha
(8–13 Hz) and beta (13–30 Hz); it is not proven optimal. Filter roll-off affects
band edges. No extra mains notch is initially needed for a passband below 50/60 Hz.
Zero-phase filtering is offline and unsuitable as a causal online decoder.

## Epoch creation
Use cue events, tmin=1 s, tmax=4 s (MNE includes endpoints), baseline=None.
Skipping the initial second is an assumption intended to reduce cue-onset transients;
visual cue confounding may persist. Inspect annotation durations to ensure windows
fit task periods. Rest is excluded. Epochs crossing BAD boundaries are rejected.
Report counts before/after dropping and retain event sample/run IDs. A pre-cue
baseline needs negative tmin; mean subtraction is not an ERD/ERS analysis.

## Planned features and models — deferred
Welch PSD, channel-wise integrated mu/beta power and log power; CSP log-variance
features fit within training folds only. Unfitted Logistic Regression, shrinkage LDA
and linear SVM factories are provided. No training or final ML experiment in Phase 1.

## Future evaluation
Accuracy, balanced accuracy (primary), right-positive precision/recall/F1, ROC-AUC
from continuous right-positive scores, and confusion matrix with left/right order.
Seed=42 for future shuffled stratified splits. Fit scaling, CSP and feature selection
inside full sklearn pipelines. Prefer held-out runs over random trial splitting;
random trial CV can be optimistic because of temporal dependence. Tune parameters
only within training data using nested evaluation when introduced. Continuous filtering
and nearby trials can share temporal information; future evaluation must use run
separation or suitable temporal buffers. Run-grouped splits do not establish unseen
subject performance. Later leave-one-subject-out validation requires more subjects.

## Limitations and stopping criteria
One subject, few trials, template montage, possible ocular/muscle artifacts, recorded
reference effects, cue effects and exploratory processing choices limit inference.
Scalp PSD and maps are descriptive; no source localization or causal conclusion.
Secondary hypothesis remains untested. Stop this phase after successful retrieval,
inspection, filtering, label verification, epoch counts and visualizations. Save software
versions, input hashes, chosen parameters and validation evidence; do not invent results.
