"""Unfitted classical baselines; no experiment is run here."""
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.svm import SVC

def make_baseline(name: str, random_state: int = 42) -> Pipeline:
    """Return scaling plus a classifier for 2-D features; fit within CV only."""
    models = {"logistic_regression": LogisticRegression(max_iter=2000, random_state=random_state),
              "lda": LinearDiscriminantAnalysis(solver="lsqr", shrinkage="auto"),
              "svm": SVC(kernel="linear", probability=False, random_state=random_state)}
    if name not in models:
        raise ValueError(f"Unknown model: {name}. Choose {list(models)}.")
    return Pipeline([("scaler", StandardScaler()), ("classifier", models[name])])
