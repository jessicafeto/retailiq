"""Stage 2 — Machine learning: faithful reproduction + corrected pipeline.

Track A (Original): reproduces the dissertation exactly — all engineered
features (including the leaking Rating/Satisfaction and definitional columns),
StandardScaler -> PCA(10) and LDA(1), 7 classifiers, accuracy on a 70/30 split.

Track B (Corrected): removes target leakage and definitional features, adds
5-fold cross-validation, class balancing and a full metric suite
(accuracy, precision, recall, F1, ROC-AUC) compared against a majority-class
baseline — the honest read of what the (simulated, near-uniform) data supports.

Exports: models.json, predictions-model.json
"""
from __future__ import annotations

import time
import warnings

import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC, LinearSVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve,
)

from common import (
    RANDOM_STATE, load_raw, clean, add_engineered, build_model_frame,
    write_artifact,
)

warnings.filterwarnings("ignore")

N_SAMPLE = 20_000
MODEL_ORDER = [
    "Logistic Regression", "KNN", "Linear SVM", "Kernel SVM",
    "Naive Bayes", "Decision Tree", "Random Forest",
]

TARGETS = [
    {
        "key": "Is_Satisfied", "label": "Customer Satisfaction",
        "description": "Whether a customer is satisfied (rating above 3).",
        "leak": ["Rating", "Satisfaction", "Price_Rating_Interaction",
                 "Review_Rating_Interaction"],
        "note": "Original track leaks: Rating (and its duplicate Satisfaction) "
                "remain in the features, so >90% accuracy is largely trivial. "
                "The corrected track drops all rating-derived columns.",
    },
    {
        "key": "Interested", "label": "Customer Interest",
        "description": "Whether a customer shows high purchase interest.",
        "leak": ["PurchaseHistory_Encoded"],
        "note": "Interest is defined directly from purchase history, which the "
                "original track leaves in the features. Corrected track removes it.",
    },
    {
        "key": "Has_Purchased_Category", "label": "Category Recommendation",
        "description": "Likelihood a customer has purchased from a category.",
        "leak": [],
        "note": "This target is near-degenerate (almost every row is positive), "
                "so ~90% accuracy simply matches the majority-class baseline.",
    },
    {
        "key": "Is_Holiday_Shopper", "label": "Seasonal (Holiday) Shopper",
        "description": "Whether a customer peaks during the holiday period.",
        "leak": None,  # drop Time Period dummies (definitional) — resolved below
        "note": "The holiday flag is derived from 'Time Period Highest Purchase'; "
                "the original track keeps its one-hot columns (leakage). Corrected "
                "track removes them.",
    },
]

TARGET_KEYS = [t["key"] for t in TARGETS]


def make_classifiers(balanced: bool):
    cw = "balanced" if balanced else None
    return {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=RANDOM_STATE, class_weight=cw),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "Linear SVM": LinearSVC(random_state=RANDOM_STATE, class_weight=cw, dual="auto"),
        "Kernel SVM": SVC(kernel="rbf", random_state=RANDOM_STATE, class_weight=cw),
        "Naive Bayes": GaussianNB(),
        "Decision Tree": DecisionTreeClassifier(random_state=RANDOM_STATE, class_weight=cw, max_depth=12),
        "Random Forest": RandomForestClassifier(n_estimators=120, random_state=RANDOM_STATE, class_weight=cw, n_jobs=-1),
    }


def scores_from(clf, X):
    """Return positive-class scores for ROC-AUC (proba or decision function)."""
    if hasattr(clf, "predict_proba"):
        return clf.predict_proba(X)[:, 1]
    if hasattr(clf, "decision_function"):
        d = clf.decision_function(X)
        return (d - d.min()) / (d.max() - d.min() + 1e-9)
    return None


def track_a(encoded: pd.DataFrame) -> dict:
    """Faithful reproduction: PCA(10) & LDA(1), accuracy only."""
    X = encoded.drop(columns=TARGET_KEYS).select_dtypes(include=[np.number])
    X = X.fillna(X.median())
    Xs = StandardScaler().fit_transform(X)
    Xp = PCA(n_components=10, random_state=RANDOM_STATE).fit_transform(Xs)

    out = {}
    for tk in TARGET_KEYS:
        y = encoded[tk].values
        Xtr, Xte, ytr, yte = train_test_split(
            Xp, y, test_size=0.3, random_state=RANDOM_STATE, stratify=y)
        # LDA on PCA features (as in the notebook)
        lda = LinearDiscriminantAnalysis(n_components=1)
        Xtr_l = lda.fit_transform(Xtr, ytr)
        Xte_l = lda.transform(Xte)

        pca_acc, lda_acc = {}, {}
        for name, clf in make_classifiers(balanced=False).items():
            clf.fit(Xtr, ytr)
            pca_acc[name] = round(accuracy_score(yte, clf.predict(Xte)) * 100, 2)
        for name, clf in make_classifiers(balanced=False).items():
            clf.fit(Xtr_l, ytr)
            lda_acc[name] = round(accuracy_score(yte, clf.predict(Xte_l)) * 100, 2)
        out[tk] = {"pca": pca_acc, "lda": lda_acc}
    return out


def track_b(encoded: pd.DataFrame) -> tuple[dict, list]:
    """Corrected pipeline: de-leaked features, CV, full metrics, baseline."""
    results = {}
    importance = []
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)

    for t in TARGETS:
        tk = t["key"]
        y = encoded[tk].values

        drop = set(TARGET_KEYS)
        if t["leak"] is None:  # holiday: drop the definitional dummies
            drop |= {c for c in encoded.columns
                     if c.startswith("Time Period Highest Purchase_")}
        else:
            drop |= set(t["leak"])
        if tk == "Has_Purchased_Category":
            # Target is defined from the Category_* dummies — dropping them
            # removes the definitional leak and exposes it as a degenerate task.
            drop |= {c for c in encoded.columns if c.startswith("Category_")}
        X = encoded.drop(columns=[c for c in drop if c in encoded.columns])
        X = X.select_dtypes(include=[np.number])
        X = X.fillna(X.median())
        feat_names = list(X.columns)
        Xs = StandardScaler().fit_transform(X)

        pos_rate = float(np.mean(y))
        base = DummyClassifier(strategy="most_frequent").fit(Xs, y)
        baseline_acc = round(accuracy_score(y, base.predict(Xs)) * 100, 2)

        Xtr, Xte, ytr, yte = train_test_split(
            Xs, y, test_size=0.25, random_state=RANDOM_STATE, stratify=y)

        per_model = {}
        best = None
        for name, clf in make_classifiers(balanced=True).items():
            clf.fit(Xtr, ytr)
            yp = clf.predict(Xte)
            sc = scores_from(clf, Xte)
            auc = float(roc_auc_score(yte, sc)) if sc is not None and len(set(yte)) > 1 else None
            # 5-fold CV accuracy for the lighter models (avoid slow kernel SVM CV)
            if name in ("Logistic Regression", "Decision Tree", "Random Forest",
                        "Naive Bayes", "Linear SVM"):
                cvs = cross_val_score(clf, Xs, y, cv=cv, scoring="accuracy", n_jobs=-1)
                cv_mean, cv_std = round(float(cvs.mean()) * 100, 2), round(float(cvs.std()) * 100, 2)
            else:
                cv_mean, cv_std = None, None
            per_model[name] = {
                "accuracy": round(accuracy_score(yte, yp) * 100, 2),
                "precision": round(precision_score(yte, yp, zero_division=0) * 100, 2),
                "recall": round(recall_score(yte, yp, zero_division=0) * 100, 2),
                "f1": round(f1_score(yte, yp, zero_division=0) * 100, 2),
                "rocAuc": round(auc, 4) if auc is not None else None,
                "cvMean": cv_mean, "cvStd": cv_std,
            }
            if name == "Random Forest":
                best = (name, clf, yte, yp, sc, feat_names)

        # confusion matrix + ROC from the headline (Random Forest) model
        name, clf, yte_b, yp_b, sc_b, fnames = best
        cm = confusion_matrix(yte_b, yp_b).tolist()
        roc_pts = []
        if sc_b is not None and len(set(yte_b)) > 1:
            fpr, tpr, _ = roc_curve(yte_b, sc_b)
            idx = np.linspace(0, len(fpr) - 1, min(40, len(fpr))).astype(int)
            roc_pts = [{"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)} for i in idx]

        results[tk] = {
            "label": t["label"], "description": t["description"], "note": t["note"],
            "positiveRate": round(pos_rate, 4), "baselineAccuracy": baseline_acc,
            "models": per_model,
            "headline": name,
            "confusionMatrix": {"labels": [0, 1], "matrix": cm},
            "roc": {"model": name, "points": roc_pts,
                    "auc": per_model[name]["rocAuc"]},
        }

        # feature importance for the satisfaction target (RF)
        if tk == "Is_Satisfied":
            imp = clf.feature_importances_
            order = np.argsort(imp)[::-1][:12]
            importance = [
                {"feature": fnames[i].replace("_", " "), "importance": round(float(imp[i]), 4)}
                for i in order
            ]

    return results, importance


def build_client_model(dfe: pd.DataFrame) -> dict:
    """Compact, transparent logistic-regression model for in-browser inference.

    Predicts customer satisfaction from human-meaningful, non-leaking inputs.
    Exports standardisation params + coefficients so the browser reproduces it.
    """
    num_feats = ["Price", "Review Count", "Age",
                 "SocialMedia_Polarity", "CustomerReviews_Polarity", "Feedback_Polarity"]
    cat_feats = ["Brand", "Category", "Style Attributes", "Season"]

    y = (dfe["Rating"] > 3).astype(int).values
    Xnum = dfe[num_feats].astype(float)
    means = Xnum.mean().to_dict()
    stds = Xnum.std().replace(0, 1).to_dict()
    Xnum_s = (Xnum - Xnum.mean()) / Xnum.std().replace(0, 1)

    Xcat = pd.get_dummies(dfe[cat_feats], drop_first=True, dtype=float)
    X = pd.concat([Xnum_s.reset_index(drop=True), Xcat.reset_index(drop=True)], axis=1)
    feat_cols = list(X.columns)

    lr = LogisticRegression(max_iter=1000, random_state=RANDOM_STATE, class_weight="balanced")
    lr.fit(X.values, y)
    acc = round(float(accuracy_score(y, lr.predict(X.values))) * 100, 2)
    auc = round(float(roc_auc_score(y, lr.predict_proba(X.values)[:, 1])), 4)

    coefs = {feat_cols[i]: round(float(lr.coef_[0][i]), 5) for i in range(len(feat_cols))}
    options = {c: sorted(dfe[c].unique().tolist()) for c in cat_feats}

    return {
        "target": "Is_Satisfied",
        "targetLabel": "Customer Satisfaction",
        "type": "logistic",
        "trainAccuracy": acc,
        "trainRocAuc": auc,
        "baselineAccuracy": round(float(max(np.mean(y), 1 - np.mean(y))) * 100, 2),
        "intercept": round(float(lr.intercept_[0]), 5),
        "numericFeatures": [
            {"name": f, "mean": round(float(means[f]), 4), "std": round(float(stds[f]), 4)}
            for f in num_feats
        ],
        "categoricalFeatures": [{"name": c, "options": options[c]} for c in cat_feats],
        "coefficients": coefs,
        "note": (
            "A real logistic-regression model trained on the simulated dataset. "
            "Because the data is largely uniform, performance sits close to the "
            "majority-class baseline — the prediction is honest, not inflated. "
            "Runs entirely in your browser."
        ),
    }


def main() -> None:
    t0 = time.time()
    print(f"Stage 2: Machine learning (sample n={N_SAMPLE:,})")
    df = clean(load_raw())
    df = df.sample(n=min(N_SAMPLE, len(df)), random_state=RANDOM_STATE).reset_index(drop=True)
    dfe = add_engineered(df)
    encoded = build_model_frame(df)
    print(f"  feature frame: {encoded.shape[0]:,} rows x {encoded.shape[1]} cols "
          f"({time.time()-t0:.1f}s)")

    a = track_a(encoded)
    print(f"  track A (reproduction) done ({time.time()-t0:.1f}s)")
    b, importance = track_b(encoded)
    print(f"  track B (corrected) done ({time.time()-t0:.1f}s)")

    # Original study's reported figures (dissertation, 29,730-row sample) for reference
    dissertation_pca = {
        "Is_Satisfied": {"Logistic Regression": 94.90, "KNN": 92.99, "Linear SVM": 94.91,
                         "Kernel SVM": 95.31, "Naive Bayes": 92.17, "Decision Tree": 92.44, "Random Forest": 95.07},
        "Interested": {"Logistic Regression": 53.11, "KNN": 50.42, "Linear SVM": 53.11,
                       "Kernel SVM": 53.06, "Naive Bayes": 53.19, "Decision Tree": 51.09, "Random Forest": 51.27},
        "Has_Purchased_Category": {"Logistic Regression": 89.85, "KNN": 88.93, "Linear SVM": 89.85,
                                   "Kernel SVM": 89.85, "Naive Bayes": 89.85, "Decision Tree": 81.33, "Random Forest": 89.84},
        "Is_Holiday_Shopper": {"Logistic Regression": 95.53, "KNN": 94.29, "Linear SVM": 95.54,
                               "Kernel SVM": 95.99, "Naive Bayes": 95.19, "Decision Tree": 93.37, "Random Forest": 95.82},
    }

    targets_out = []
    for t in TARGETS:
        tk = t["key"]
        targets_out.append({
            "key": tk, "label": t["label"], "description": t["description"],
            "note": t["note"],
            "positiveRate": b[tk]["positiveRate"],
            "baselineAccuracy": b[tk]["baselineAccuracy"],
            "dissertationPca": dissertation_pca[tk],
            "reproductionPca": a[tk]["pca"],
            "reproductionLda": a[tk]["lda"],
            "corrected": b[tk]["models"],
            "headline": b[tk]["headline"],
            "confusionMatrix": b[tk]["confusionMatrix"],
            "roc": b[tk]["roc"],
        })

    models = {
        "sample": {"size": N_SAMPLE, "split": "stratified", "randomState": RANDOM_STATE,
                   "reduction": {"pca": 10, "lda": 1}},
        "modelOrder": MODEL_ORDER,
        "targets": targets_out,
        "featureImportance": importance,
    }
    write_artifact("models.json", models)

    client = build_client_model(dfe)
    write_artifact("predictions-model.json", client)
    print(f"Stage 2 complete ({time.time()-t0:.1f}s).")


if __name__ == "__main__":
    main()
