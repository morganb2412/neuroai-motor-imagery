"""Welch PSD and integrated channel-wise band power in physical units."""
import mne
import numpy as np
from scipy.integrate import trapezoid

BANDS = {"mu_alpha": (8., 13.), "beta": (13., 30.)}

def compute_psd(data: mne.io.BaseRaw | mne.Epochs, fmin: float = 1., fmax: float = 40.,
                window_seconds: float = 2.) -> mne.time_frequency.Spectrum:
    """Compute Welch density (V²/Hz); preserve channels and trial dimensions."""
    n_fft = min(int(window_seconds * data.info["sfreq"]), len(data.times))
    if n_fft < 2 or not 0 <= fmin < fmax <= data.info["sfreq"] / 2:
        raise ValueError("Invalid PSD window or frequency limits.")
    return data.compute_psd(method="welch", fmin=fmin, fmax=fmax, picks="eeg",
                            n_fft=n_fft, n_per_seg=n_fft, n_overlap=n_fft // 2)

def band_power(spectrum: mne.time_frequency.Spectrum,
               bands: dict[str, tuple[float, float]] | None = None) -> dict[str, np.ndarray]:
    """Integrate PSD within each band (V²); require full frequency coverage.

    Shared 13-Hz endpoint is integration boundary, not a distinct physiological class.
    """
    power, freqs = spectrum.get_data(return_freqs=True)
    output = {}
    for name, (low, high) in (BANDS if bands is None else bands).items():
        mask = (freqs >= low) & (freqs <= high)
        if low >= high or low < freqs[0] or high > freqs[-1] or mask.sum() < 2:
            raise ValueError(f"PSD does not cover band {name} with at least two bins.")
        output[name] = trapezoid(power[..., mask], freqs[mask], axis=-1)
    return output
