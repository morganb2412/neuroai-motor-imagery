"""Descriptive scalp maps, not anatomical source localization."""
import numpy as np
import mne

def plot_channel_map(values: np.ndarray, info: mne.Info):
    """Map one value per EEG channel using template electrode coordinates."""
    picks = mne.pick_types(info, eeg=True, exclude=[])
    if np.asarray(values).shape != (len(picks),):
        raise ValueError("Provide one value per EEG channel, in info order.")
    return mne.viz.plot_topomap(values, mne.pick_info(info, picks), show=False)
