"""Transparent QC without automatically fitting artifact-removal models."""
import mne
import pandas as pd

def epoch_counts(epochs: mne.Epochs) -> pd.Series:
    """Count retained trials in both classes, including zero counts."""
    return pd.Series({name: int((epochs.events[:, 2] == code).sum())
                      for name, code in epochs.event_id.items()}, name="retained_epochs")

def drop_summary(epochs: mne.Epochs) -> pd.Series:
    """Count each MNE drop reason; one epoch may have multiple reasons."""
    return pd.Series([reason for reasons in epochs.drop_log for reason in reasons],
                     dtype="object").value_counts()
