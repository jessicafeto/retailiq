"""Stage 1 — EDA, product analytics and market basket analysis.

Runs on the full dataset for aggregates and a large sample for Apriori.
Exports: dataset-overview.json, distributions.json, product-analytics.json,
market-basket.json
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

from common import (
    RANDOM_STATE, load_raw, clean, add_engineered,
    AGE_LABELS, write_artifact,
)

NUMERIC = ["Price", "Rating", "Review Count", "Age"]


def numeric_summary(s: pd.Series) -> dict:
    return {
        "min": float(s.min()), "max": float(s.max()),
        "mean": float(s.mean()), "median": float(s.median()),
        "std": float(s.std()),
        "q1": float(s.quantile(0.25)), "q3": float(s.quantile(0.75)),
    }


def histogram(s: pd.Series, bins: int = 24) -> dict:
    counts, edges = np.histogram(s.dropna(), bins=bins)
    centers = (edges[:-1] + edges[1:]) / 2
    return {
        "bins": [
            {"x0": float(edges[i]), "x1": float(edges[i + 1]),
             "center": float(centers[i]), "count": int(counts[i])}
            for i in range(len(counts))
        ]
    }


def cat_counts(s: pd.Series) -> list[dict]:
    vc = s.value_counts()
    return [{"label": str(k), "count": int(v)} for k, v in vc.items()]


def main() -> None:
    print("Stage 1: EDA + Market Basket")
    df_full = clean(load_raw())
    n_rows = len(df_full)
    print(f"  loaded {n_rows:,} rows")

    # ---------------------------------------------------------- dataset overview
    overview = {
        "generatedRows": n_rows,
        "sourceRows": n_rows,
        "columns": 20,
        "isSimulated": True,
        "note": (
            "Simulated fashion retail dataset (Kaggle). The original MSc study "
            "used a 29,730-row sample; RetailIQ analyses the full 1,000,000-row "
            "dataset. Figures demonstrate methodology, not real market data."
        ),
        "cardinality": {
            "brands": int(df_full["Brand"].nunique()),
            "categories": int(df_full["Category"].nunique()),
            "styles": int(df_full["Style Attributes"].nunique()),
            "seasons": int(df_full["Season"].nunique()),
            "colors": int(df_full["Color"].nunique()),
        },
        "brands": sorted(df_full["Brand"].unique().tolist()),
        "categories": sorted(df_full["Category"].unique().tolist()),
        "styles": sorted(df_full["Style Attributes"].unique().tolist()),
        "seasons": sorted(df_full["Season"].unique().tolist()),
        "colors": sorted(df_full["Color"].unique().tolist()),
        "numeric": {c: numeric_summary(df_full[c]) for c in NUMERIC},
        "missingValues": int(df_full.isnull().sum().sum()),
    }
    write_artifact("dataset-overview.json", overview)

    # ---------------------------------------------------------------- distributions
    dfe = add_engineered(df_full)
    distributions = {
        "numeric": {
            "Price": histogram(df_full["Price"]),
            "Rating": histogram(df_full["Rating"], bins=5),
            "Review Count": histogram(df_full["Review Count"]),
            "Age": histogram(df_full["Age"]),
        },
        "categorical": {
            "Brand": cat_counts(df_full["Brand"]),
            "Category": cat_counts(df_full["Category"]),
            "Style Attributes": cat_counts(df_full["Style Attributes"]),
            "Season": cat_counts(df_full["Season"]),
            "Color": cat_counts(df_full["Color"]),
            "Description": cat_counts(df_full["Description"]),
            "Purchase History": cat_counts(df_full["Purchase History"]),
            "Time Period Highest Purchase": cat_counts(df_full["Time Period Highest Purchase"]),
        },
        "ageGroup": [
            {"label": lbl, "count": int((dfe["Age_Group"] == lbl).sum())}
            for lbl in AGE_LABELS
        ],
        "sentiment": {
            "Social Media Comments": cat_counts(df_full["Social Media Comments"]),
            "Customer Reviews": cat_counts(df_full["Customer Reviews"]),
            "feedback": cat_counts(df_full["feedback"]),
        },
    }
    write_artifact("distributions.json", distributions)

    # ------------------------------------------------------------- product analytics
    def group_metrics(col: str) -> list[dict]:
        g = df_full.groupby(col).agg(
            count=("Price", "size"),
            avgPrice=("Price", "mean"),
            avgRating=("Rating", "mean"),
            avgReviews=("Review Count", "mean"),
        ).reset_index()
        return [
            {
                "label": str(r[col]), "count": int(r["count"]),
                "avgPrice": float(r["avgPrice"]), "avgRating": float(r["avgRating"]),
                "avgReviews": float(r["avgReviews"]),
            }
            for _, r in g.iterrows()
        ]

    # price band x rating cross-tab
    price_bands = pd.cut(
        df_full["Price"], bins=[0, 25, 50, 75, 100],
        labels=["£0–25", "£25–50", "£50–75", "£75–100"], include_lowest=True,
    )
    ct = pd.crosstab(price_bands, df_full["Rating"].astype(int), normalize="index")
    price_rating = {
        "bands": list(ct.index.astype(str)),
        "ratings": [int(c) for c in ct.columns],
        "matrix": ct.round(4).values.tolist(),
    }

    product_analytics = {
        "byBrand": group_metrics("Brand"),
        "byCategory": group_metrics("Category"),
        "byStyle": group_metrics("Style Attributes"),
        "priceRatingCrosstab": price_rating,
    }
    write_artifact("product-analytics.json", product_analytics)

    # ---------------------------------------------------------------- market basket
    # Each product row is a transaction of {its category, its style}. Apriori
    # mirrors the dissertation (min_support=0.01, lift >= 1.1).
    sample = df_full.sample(n=min(200_000, n_rows), random_state=RANDOM_STATE)
    cat_oh = pd.get_dummies(sample["Category"], prefix="Category")
    sty_oh = pd.get_dummies(sample["Style Attributes"], prefix="Style")
    basket = pd.concat([cat_oh, sty_oh], axis=1).astype(bool)

    itemsets = apriori(basket, min_support=0.01, use_colnames=True)
    rules = association_rules(itemsets, metric="lift", min_threshold=1.0)
    rules = rules.sort_values("lift", ascending=False)

    def name_set(s) -> str:
        return ", ".join(sorted(str(x) for x in s))

    rules_out = [
        {
            "antecedent": name_set(r["antecedents"]),
            "consequent": name_set(r["consequents"]),
            "support": float(r["support"]),
            "confidence": float(r["confidence"]),
            "lift": float(r["lift"]),
        }
        for _, r in rules.iterrows()
    ][:60]

    # lift heatmap: category (rows) x style (cols) for single-item rules
    cats = sorted(sample["Category"].unique())
    stys = sorted(sample["Style Attributes"].unique())
    lift_lookup = {}
    for _, r in rules.iterrows():
        a, c = list(r["antecedents"]), list(r["consequents"])
        if len(a) == 1 and len(c) == 1:
            lift_lookup[(str(a[0]), str(c[0]))] = float(r["lift"])
    heat = []
    for cat in cats:
        row = []
        for sty in stys:
            key1 = (f"Category_{cat}", f"Style_{sty}")
            key2 = (f"Style_{sty}", f"Category_{cat}")
            row.append(lift_lookup.get(key1, lift_lookup.get(key2)))
        heat.append(row)

    market_basket = {
        "params": {"minSupport": 0.01, "liftThreshold": 1.0, "sampleSize": len(sample)},
        "ruleCount": len(rules_out),
        "rules": rules_out,
        "heatmap": {"categories": cats, "styles": stys, "lift": heat},
    }
    write_artifact("market-basket.json", market_basket)
    print("Stage 1 complete.")


if __name__ == "__main__":
    main()
