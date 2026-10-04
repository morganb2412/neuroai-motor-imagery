"""Explicit binary metrics; left=1, right=2 (positive class)."""
import numpy as np
from sklearn.metrics import (accuracy_score, balanced_accuracy_score, precision_score,
                            recall_score, f1_score, roc_auc_score, confusion_matrix)

def classification_metrics(y_true: np.ndarray, y_pred: np.ndarray,
                           y_score: np.ndarray | None = None,
                           labels: tuple[int, int] = (1, 2)) -> dict:
    """Scores must be 1-D probabilities/decision scores for labels[1].

    AUC is None when scores are absent or only one true class is present.
    """
    if len(labels) != 2 or labels[0] == labels[1]:
        raise ValueError("Supply two distinct labels.")
    if not set(np.unique(y_true)).issubset(labels) or not set(np.unique(y_pred)).issubset(labels):
        raise ValueError("Observed labels do not match supplied binary labels.")
    result = {"accuracy": accuracy_score(y_true, y_pred),
              "balanced_accuracy": balanced_accuracy_score(y_true, y_pred),
              "precision": precision_score(y_true, y_pred, pos_label=labels[1], zero_division=0),
              "recall": recall_score(y_true, y_pred, pos_label=labels[1], zero_division=0),
              "f1": f1_score(y_true, y_pred, pos_label=labels[1], zero_division=0),
              "roc_auc": None, "confusion_matrix": confusion_matrix(y_true, y_pred, labels=labels),
              "label_order": labels}
    if y_score is not None and len(np.unique(y_true)) == 2:
        result["roc_auc"] = roc_auc_score(np.asarray(y_true) == labels[1], y_score)
    return result
