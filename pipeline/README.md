# RetailIQ analytics pipeline

Offline Python pipeline that turns the raw Kaggle dataset into the JSON
artifacts consumed by the web app (`src/data/*.json`). It runs locally; the
deployed site is fully static and never executes Python.

## What it does

1. **`01_eda_mba.py`** — EDA, product analytics and market basket analysis on
   the full 1,000,000-row dataset. Exports `dataset-overview.json`,
   `distributions.json`, `product-analytics.json`, `market-basket.json`.
2. **`02_models.py`** — machine learning on a 20,000-row stratified sample.
   Exports `models.json` and `predictions-model.json`.
3. **`common.py`** — shared loading, cleaning, feature engineering and encoding,
   faithful to the original dissertation notebook.

## Two modelling tracks (why the numbers differ)

- **Track A — Original reproduction.** Reproduces the dissertation exactly:
  all engineered features (including `Rating`/`Satisfaction` and definitional
  columns), `StandardScaler → PCA(10)` and `LDA(1)`, seven classifiers, accuracy
  on a 70/30 split.
- **Track B — Corrected.** Removes target leakage and definitional features,
  adds 5-fold cross-validation, class balancing, and a full metric suite
  (accuracy, precision, recall, F1, ROC-AUC) versus a majority-class baseline.

The gap between the tracks is the point: e.g. customer-satisfaction accuracy
falls from ~99% (with `Rating` leaking into the features) to ~50% (baseline)
once the leak is removed — an honest read of a largely uniform, **simulated**
dataset.

> The original MSc study used a 29,730-row sample; those reported figures are
> preserved in `models.json` as `dissertationPca` for reference. RetailIQ
> analyses the full 1,000,000-row dataset.

## Running it

```bash
python3 -m venv .venv
.venv/bin/pip install pandas numpy scikit-learn mlxtend
.venv/bin/python 01_eda_mba.py
.venv/bin/python 02_models.py
```

The raw CSV (`data/raw/mock_fashion_data_uk_us.csv`, ~168 MB) is git-ignored;
download it from Kaggle (`a23bisola/fashion-dataset-uk-us`) and place it there.
