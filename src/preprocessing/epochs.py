"""Run-aware left/right imagery events and trial metadata."""
from collections.abc import Sequence
import mne
import numpy as np
import pandas as pd
from src.data.load_eeg import IMAGERY_RUNS

EVENT_ID = {"left_hand": 1, "right_hand": 2}

def extract_imagery_events(raw: mne.io.BaseRaw, runs: Sequence[int] = IMAGERY_RUNS
                           ) -> tuple[np.ndarray, dict[str, int]]:
    """Map T1/T2 only for unilateral imagery runs 4, 8, 12.

    Caller must provide the actual ordered runs used to load this recording.
    T0 is rest and is excluded; event integers are explicitly assigned.
    """
    if not runs or any(r not in IMAGERY_RUNS for r in runs):
        raise ValueError("Left/right imagery mapping is restricted to runs 4, 8, 12.")
    if not {"T1", "T2"}.issubset(set(raw.annotations.description)):
        raise ValueError("Both T1 and T2 annotations are required.")
    events, _ = mne.events_from_annotations(raw, event_id={"T1": 1, "T2": 2})
    return events, EVENT_ID.copy()

def create_imagery_epochs(raw: mne.io.BaseRaw, runs: Sequence[int] = IMAGERY_RUNS,
                          tmin: float = 1., tmax: float = 4.,
                          baseline: tuple[float | None, float | None] | None = None,
                          reject: dict[str, float] | None = None) -> mne.Epochs:
    """Create EEG trials; default excludes first cue second and uses no baseline.

    Amplitude rejection, if supplied, uses volts. Reject boundary-crossing epochs.
    Record run identity for future grouped evaluation. A negative tmin is required
    if a pre-cue baseline is desired; filtered baselines are not ERD normalization.
    """
    if tmin >= tmax:
        raise ValueError("tmin must be less than tmax.")
    events, event_id = extract_imagery_events(raw, runs)
    boundaries = raw.annotations.onset[raw.annotations.description == "BAD boundary"]
    boundary_samples = raw.time_as_index(boundaries, use_rounding=True) + raw.first_samp
    if len(boundaries) != len(runs) - 1:
        raise ValueError("Run list does not match concatenated recording boundaries.")
    indices = np.searchsorted(boundary_samples, events[:, 0], side="right")
    metadata = pd.DataFrame({"run": np.asarray(runs)[indices],
                             "condition": ["left_hand" if e == 1 else "right_hand" for e in events[:, 2]],
                             "event_sample": events[:, 0]})
    epochs = mne.Epochs(raw, events, event_id, tmin=tmin, tmax=tmax, baseline=baseline,
                        picks="eeg", preload=True, reject=reject, reject_by_annotation=True,
                        metadata=metadata)
    if len(epochs) == 0:
        raise ValueError("No epochs survived. Inspect timing, annotations and rejection settings.")
    return epochs
