"""Fold-local fitting with optional run/subject grouping."""
import numpy as np
from sklearn.model_selection import StratifiedKFold, StratifiedGroupKFold, cross_validate
from sklearn.pipeline import Pipeline

def evaluate_pipeline(estimator: Pipeline, X: np.ndarray, y: np.ndarray,
                      n_splits: int = 3, groups: np.ndarray | None = None,
                      random_state: int = 42) -> dict:
    """Clone and fit a full feature/scaling/model pipeline separately per fold.

    Never pre-fit CSP, feature selection, imputation or scaling on all data.
    Groups may be run IDs now or subject IDs later. Stratified trial CV is
    exploratory: within-run temporal dependencies can inflate its estimates.
    """
    if not isinstance(estimator, Pipeline):
        raise TypeError("Pass a Pipeline containing every learned transformation.")
    _, counts = np.unique(y, return_counts=True)
    if len(counts) != 2 or n_splits < 2 or counts.min() < n_splits:
        raise ValueError("Require two classes and at least n_splits trials per class.")
    if groups is None:
        cv = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
        splits = list(cv.split(X, y))
    else:
        if len(np.unique(groups)) < n_splits:
            raise ValueError("Not enough independent groups for requested folds.")
        cv = StratifiedGroupKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
        splits = list(cv.split(X, y, groups))
    for train, test in splits:
        if len(np.unique(y[train])) != 2 or len(np.unique(y[test])) != 2:
            raise ValueError("Each fold must contain both classes; revise grouping/splits.")
    return cross_validate(estimator, X, y, cv=splits,
                          scoring=["accuracy", "balanced_accuracy", "roc_auc"], error_score="raise")
