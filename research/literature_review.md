# Initial reading notes — incomplete literature review

- [PhysioNet dataset, Schalk (2009), v1.0.0](https://doi.org/10.13026/C28G6P):
  authoritative source for recording protocol, labels and data citation.
- [Schalk et al. (2004), BCI2000](https://doi.org/10.1109/TBME.2004.827072):
  original acquisition-system publication cited by the dataset.
- [MNE CSP tutorial](https://mne.tools/stable/auto_examples/decoding/decoding_csp_eeg.html):
  implementation reference for fold-local CSP. Its task/run selection is not assumed
  to match unilateral left/right imagery; this project uses runs 4, 8, 12.
- [MNE EEGBCI loader](https://mne.tools/stable/generated/mne.datasets.eegbci.load_data.html):
  retrieval and run definitions.

These are starting references, not a systematic review. TODO: review primary studies
on sensorimotor mu/beta rhythms, CSP assumptions, EEG artifacts and validation bias;
record full citations and task-specific evidence before writing scientific conclusions.
