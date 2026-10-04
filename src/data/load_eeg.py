"""Download EDF recordings using MNE's versioned PhysioNet EEGBCI source."""
from pathlib import Path
from collections.abc import Sequence
import mne
from mne.datasets import eegbci

IMAGERY_RUNS = (4, 8, 12)

def download_eeg(subject: int, runs: int | Sequence[int], data_dir: str | Path) -> list[Path]:
    """Return cached/downloaded EDF paths; do not change global MNE configuration."""
    runs = [runs] if isinstance(runs, int) else list(runs)
    if not isinstance(subject, int) or not 1 <= subject <= 109:
        raise ValueError("Subject must be an integer from 1 to 109.")
    if not runs or any(not isinstance(r, int) or not 1 <= r <= 14 for r in runs):
        raise ValueError("Runs must be integers from 1 to 14.")
    if len(set(runs)) != len(runs):
        raise ValueError("Duplicate runs would duplicate trials.")
    data_dir = Path(data_dir).resolve()
    try:
        data_dir.mkdir(parents=True, exist_ok=True)
        files = eegbci.load_data(subject, runs, path=str(data_dir), update_path=False,
                                base_url="https://physionet.org/files/eegmmidb/1.0.0/")
    except Exception as exc:
        raise RuntimeError(f"EEGBCI retrieval failed for subject {subject}, runs {runs}. "
                           f"Check network access, disk space and permissions at {data_dir}. "
                           "Retry after resolving the underlying error; cached files are reused.") from exc
    paths = [Path(f) for f in files]
    if len(paths) != len(runs) or not all(f.is_file() for f in paths):
        raise RuntimeError("Download returned missing or incomplete EDF paths.")
    return paths

def load_eeg(subject: int = 1, runs: int | Sequence[int] = IMAGERY_RUNS,
             data_dir: str | Path = "data/raw", preload: bool = True) -> mne.io.BaseRaw:
    """Load and concatenate runs, retaining MNE boundary annotations.

    Standardize EEGBCI channel names and attach approximate standard_1005 positions.
    The montage is a template, not measured individual anatomy. No rereferencing occurs.
    """
    paths = download_eeg(subject, runs, data_dir)
    recordings = []
    for path in paths:
        try:
            raw = mne.io.read_raw_edf(path, preload=preload, verbose=False)
            eegbci.standardize(raw)
            montage = ("colin27_1005" if "colin27_1005" in mne.channels.get_builtin_montages()
                       else "standard_1005")
            raw.set_montage(montage, on_missing="raise")
            recordings.append(raw)
        except Exception as exc:
            raise RuntimeError(f"Cannot read/standardize EDF {path}. Check file integrity; "
                               "a corrupt cached file may need to be downloaded again.") from exc
    return mne.concatenate_raws(recordings, preload=preload)
