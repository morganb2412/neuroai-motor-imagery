# NeuroAI Motor Imagery

An evolving, reproducible NeuroAI research project by Morgan Brown, exploring how
classical EEG analysis and machine learning can study imagined movement.

This repository documents work in progress: the research question, experimental
protocol, executable notebooks, Python analysis tools, and a visual research workspace.

## Start here
- Read the [research question](research/research_question.md) and
  [experimental protocol](research/experimental_protocol.md).
- Explore the [dataset notebook](notebooks/01_dataset_exploration.ipynb) and
  [preprocessing notebook](notebooks/02_eeg_preprocessing.ipynb).
- Follow the [research log](research/research_log.md) and
  [Phase 1 verification record](experiments/experiment_001/verification.json).
- Try the [research interface](frontend/README.md), which displays synthetic demo data.

## Research focus

**Research question:** Can classical machine-learning models distinguish imagined left-hand from right-hand movement in EEG, and which EEG features contribute most strongly?

**Primary hypothesis:** EEG activity during imagined left- and right-hand movement contains distinguishable patterns that can be classified above chance using machine-learning methods.

**Secondary hypothesis:** Features associated with sensorimotor scalp regions will contribute more strongly to classification than features from unrelated regions.

## Current phase
Phase 1: retrieve, inspect, preprocess, epoch and visualize subject 1 from PhysioNet
EEGMMIDB. Runs 4, 8, 12 contain left/right fist imagery. No final ML experiment,
deep-learning framework or hypothesis-testing result is included. Model/CSP factories
are reusable foundations only; notebooks 03–06 are explicitly deferred placeholders.

## Structure
- `research/`: question, hypotheses, source notes, protocol and reusable research log.
- `data/raw/`, `data/processed/`: ignored local EEG caches and derivatives.
- `notebooks/`: two executable teaching notebooks and four future-phase placeholders.
- `src/`: modular loading, filtering, epoching, QC, PSD, CSP, classifier, metric,
  cross-validation and plotting utilities.
- `experiments/experiment_001/`: shared configuration and verification provenance.
- `results/figures/`, `results/tables/`: output locations; `tests/`: offline checks.

## Environment and launch
Python 3.11+; use 3.11 for the verified environment. From the project root:
```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m ipykernel install --prefix "$VIRTUAL_ENV" --name neuroai-motor-imagery --display-name "NeuroAI motor imagery"
python -m jupyter lab
```
Open `notebooks/01_dataset_exploration.ipynb`, select the NeuroAI kernel and run all
cells in order. Continue with `02_eeg_preprocessing.ipynb`. First loading downloads
three EDFs; network access is required. Loader errors preserve the underlying cause.
If download fails, check connectivity and permissions; retry to reuse cached files.
A corrupt cached EDF may require removing that specific file and downloading again.

## Reproducibility and scientific scope
Parameters are centralized in `experiments/experiment_001/config.json`. Defaults:
8–30 Hz offline FIR, 1–4 s after cue, no baseline correction, no automatic artifact
rejection, recorded reference, template montage. Consult the protocol for limitations.
Run `python -m unittest discover -s tests -v` for offline utility checks.
Verification records and software versions are kept with experiment 001. For a clean
reproduction of the verified environment, install its `environment.lock.txt` instead
of the broad requirements file. These files describe an execution environment,
not evidence for decoding performance. Record future scientific observations in the log.

## Sources and attribution
[PhysioNet EEGMMIDB v1.0.0](https://doi.org/10.13026/C28G6P), Schalk (2009),
under Open Data Commons Attribution License v1.0. Cite the dataset, its original
[BCI2000 publication](https://doi.org/10.1109/TBME.2004.827072), and the PhysioNet
citation requested on its [dataset page](https://physionet.org/content/eegmmidb/1.0.0/)
in future publications. [MNE loader documentation](https://mne.tools/stable/generated/mne.datasets.eegbci.load_data.html)
provides acquisition utilities. This project makes no clinical or causal claims.

## Verified Phase 1 status
On 2026-10-03, both notebooks' code cells executed headlessly on subject 1:
64 channels at 160 Hz; 45 retained epochs (23 left, 22 right), no drops under
the configured settings. Four offline tests passed; all notebooks validate and
package dependencies are consistent. These observations do not establish artifact
freedom or either hypothesis. See `experiments/experiment_001/verification.json`
for hashes, versions and saved figure paths. Re-run headless verification with:
```bash
python experiments/experiment_001/verify_phase1.py
```

## Front-end research workspace
The separate React/Vite app is in [`frontend/`](frontend/README.md). It uses synthetic
UI demonstrations and does not alter the verified Python pipeline or establish model
results. Run `npm ci` then `npm run dev` from that directory.
