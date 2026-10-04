"""Static notebook-friendly plots; EEG input units are volts."""
import matplotlib.pyplot as plt
import mne

def plot_raw_segment(raw: mne.io.BaseRaw, start: float = 0., duration: float = 5.,
                     channels: tuple[str, ...] = ("C3", "Cz", "C4")):
    """Plot central channels in µV without an interactive GUI dependency."""
    if start < 0 or duration <= 0 or start + duration > raw.times[-1]:
        raise ValueError("Requested segment is outside the recording.")
    segment = raw.copy().crop(tmin=start, tmax=start + duration)
    values = segment.get_data(picks=list(channels)) * 1e6
    fig, axes = plt.subplots(len(channels), 1, sharex=True, figsize=(10, 5), squeeze=False)
    for ax, name, signal in zip(axes[:, 0], channels, values):
        ax.plot(segment.times + start, signal); ax.set_ylabel(f"{name} (µV)")
    axes[-1, 0].set_xlabel("Time (s)"); fig.tight_layout()
    return fig

def plot_example_epoch(epochs: mne.Epochs, condition: str, channel: str = "C3"):
    """Plot the first retained trial, not a classification result."""
    selected = epochs[condition]
    if not len(selected):
        raise ValueError(f"No retained {condition} epochs.")
    fig, ax = plt.subplots(figsize=(9, 3))
    ax.plot(selected.times, selected.get_data(picks=[channel])[0, 0] * 1e6)
    ax.set(xlabel="Time after cue (s)", ylabel=f"{channel} (µV)", title=condition)
    fig.tight_layout(); return fig
