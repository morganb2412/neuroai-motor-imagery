"""Fixed, exploratory motor-imagery filtering."""
import mne

def bandpass_filter(raw: mne.io.BaseRaw, l_freq: float = 8., h_freq: float = 30.,
                    method: str = "fir") -> mne.io.BaseRaw:
    """Return a filtered copy; zero-phase offline filtering is not causal.

    MNE skips recording edges, preventing convolution across concatenated runs.
    Mu/beta focus is an initial assumption, not an optimal-band claim.
    """
    if not 0 < l_freq < h_freq < raw.info["sfreq"] / 2:
        raise ValueError("Require 0 < l_freq < h_freq < Nyquist frequency.")
    return raw.copy().load_data().filter(l_freq, h_freq, picks="eeg", method=method,
                                        skip_by_annotation=("edge", "bad_acq_skip"))
