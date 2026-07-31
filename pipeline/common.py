"""Shared utilities and feature engineering for the RetailIQ pipeline.

Reproduces the dissertation's methodology (cleaning, feature engineering,
encoding, target creation) so downstream artifacts are faithful to the original
research, while remaining explicit about known integrity issues (target leakage,
degenerate targets) that the corrected modelling track addresses.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW_CSV = ROOT / "pipeline" / "data" / "raw" / "mock_fashion_data_uk_us.csv"
OUT_DIR = ROOT / "src" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)

RANDOM_STATE = 42

# ----------------------------------------------------------------- ordinal maps
DESCRIPTION_MAP = {
    "Worst": 1, "Very Bad": 2, "Bad": 3, "Not Good": 4,
    "Good": 5, "Very Good": 6, "Best": 7,
}
PURCHASE_HISTORY_MAP = {
    "Negligible": 1, "Very Low": 2, "Low": 3, "Below Average": 4,
    "Average": 5, "Medium": 6, "Above Average": 7, "Significant": 8,
    "High": 9, "Very High": 10,
}
SEASON_MAP = {
    "Winter": 0, "Spring": 1, "Summer": 2, "Fall": 3,
    "Spring/Summer": 4, "Fall/Winter": 5,
}
# Approximate the dissertation's TextBlob sentiment on the (categorical) text
# columns by mapping each label to a representative polarity.
SENTIMENT_MAP = {
    "Positive": 0.227, "Negative": -0.30, "Neutral": 0.0,
    "Mixed": 0.0, "Other": 0.0, "Unknown": 0.0,
}
AGE_BINS = [18, 25, 35, 50, 64]
AGE_LABELS = ["Young Adults", "Millennials", "Gen X", "Boomers"]

ONE_HOT_COLS = [
    "Brand", "Category", "Style Attributes", "Color",
    "Fashion Magazines", "Fashion Influencers", "Time Period Highest Purchase",
]


def load_raw(nrows: int | None = None) -> pd.DataFrame:
    return pd.read_csv(RAW_CSV, nrows=nrows)


def clean(df: pd.DataFrame) -> pd.DataFrame:
    """Reproduce the dissertation cleaning: drop missing rows and Product Name."""
    df = df.dropna().copy()
    if "Product Name" in df.columns:
        df = df.drop(columns=["Product Name"])
    return df


def add_engineered(df: pd.DataFrame) -> pd.DataFrame:
    """Add interaction, age-group and sentiment features (pre-encoding)."""
    df = df.copy()
    df["Price_Rating_Interaction"] = df["Price"] * df["Rating"]
    df["Review_Rating_Interaction"] = df["Review Count"] * df["Rating"]
    df["Age_Group"] = pd.cut(
        df["Age"], bins=AGE_BINS, labels=AGE_LABELS, right=True, include_lowest=True
    )
    df["SocialMedia_Polarity"] = df["Social Media Comments"].map(SENTIMENT_MAP)
    df["CustomerReviews_Polarity"] = df["Customer Reviews"].map(SENTIMENT_MAP)
    df["Feedback_Polarity"] = df["feedback"].map(SENTIMENT_MAP)
    return df


def build_model_frame(df: pd.DataFrame) -> pd.DataFrame:
    """Encode + create the four classification targets (faithful to notebook).

    Returns a fully numeric frame including the four target columns:
    Is_Satisfied, Interested, Has_Purchased_Category, Is_Holiday_Shopper.
    """
    df = df.copy()

    # Derive the holiday-shopper flag before one-hot removes the source column.
    df["Is_Holiday_Shopper"] = (
        df["Time Period Highest Purchase"] == "Holiday"
    ).astype(int)

    # Ordinal encodings
    df["Description_Encoded"] = df["Description"].map(DESCRIPTION_MAP)
    df["PurchaseHistory_Encoded"] = df["Purchase History"].map(PURCHASE_HISTORY_MAP)
    df["Season_Encoded"] = df["Season"].map(SEASON_MAP)

    # One-hot encodings
    encoded = pd.get_dummies(
        df, columns=ONE_HOT_COLS, drop_first=True, dtype=int
    )

    # Targets
    encoded["Satisfaction"] = encoded["Rating"]
    encoded["Is_Satisfied"] = (encoded["Rating"] > 3).astype(int)
    encoded["Interested"] = (encoded["PurchaseHistory_Encoded"] > 5).astype(int)
    category_cols = [c for c in encoded.columns if c.startswith("Category_")]
    encoded["Has_Purchased_Category"] = (
        encoded[category_cols].sum(axis=1) > 0
    ).astype(int)

    # Drop raw text / non-numeric helper columns
    drop_cols = [
        "Description", "Purchase History", "Season", "Age_Group",
        "Social Media Comments", "Customer Reviews", "feedback",
        "Total Sizes", "Available Sizes",
    ]
    encoded = encoded.drop(columns=[c for c in drop_cols if c in encoded.columns])
    return encoded


# ------------------------------------------------------------------- json utils
def _default(o):
    if isinstance(o, (np.integer,)):
        return int(o)
    if isinstance(o, (np.floating,)):
        return None if (math.isnan(o) or math.isinf(o)) else float(o)
    if isinstance(o, (np.bool_,)):
        return bool(o)
    if isinstance(o, np.ndarray):
        return o.tolist()
    raise TypeError(f"not serialisable: {type(o)}")


def round_floats(obj, ndigits=4):
    if isinstance(obj, float):
        return None if (math.isnan(obj) or math.isinf(obj)) else round(obj, ndigits)
    if isinstance(obj, dict):
        return {k: round_floats(v, ndigits) for k, v in obj.items()}
    if isinstance(obj, list):
        return [round_floats(v, ndigits) for v in obj]
    return obj


def write_artifact(name: str, data: dict) -> None:
    path = OUT_DIR / name
    with open(path, "w") as f:
        json.dump(round_floats(data), f, default=_default, indent=2)
    size = path.stat().st_size
    print(f"  ✓ {name}  ({size/1024:.1f} KB)")
