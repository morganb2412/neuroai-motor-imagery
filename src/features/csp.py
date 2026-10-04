"""Reusable CSP factory; fitting is deferred to later experiments."""
from mne.decoding import CSP

def make_csp(n_components: int = 4, reg: str | float | None = "ledoit_wolf") -> CSP:
    """Create a log-power CSP transformer. Fit only on training-fold epochs."""
    return CSP(n_components=n_components, reg=reg, log=True, norm_trace=False)
