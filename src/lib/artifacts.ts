/**
 * Typed accessors for the analytics artifacts produced by the Python pipeline
 * (see /pipeline). Every figure the UI shows traces back to one of these files.
 */
import datasetOverview from "@/data/dataset-overview.json";
import distributions from "@/data/distributions.json";
import productAnalytics from "@/data/product-analytics.json";
import marketBasket from "@/data/market-basket.json";
import models from "@/data/models.json";
import predictionsModel from "@/data/predictions-model.json";

// ----------------------------------------------------------------- overview
export interface NumericSummary {
  min: number; max: number; mean: number; median: number;
  std: number; q1: number; q3: number;
}
export interface DatasetOverview {
  generatedRows: number;
  sourceRows: number;
  columns: number;
  isSimulated: boolean;
  note: string;
  cardinality: { brands: number; categories: number; styles: number; seasons: number; colors: number };
  brands: string[]; categories: string[]; styles: string[]; seasons: string[]; colors: string[];
  numeric: Record<string, NumericSummary>;
  missingValues: number;
}

// -------------------------------------------------------------- distributions
export interface HistogramBin { x0: number; x1: number; center: number; count: number }
export interface CategoryCount { label: string; count: number }
export interface Distributions {
  numeric: Record<string, { bins: HistogramBin[] }>;
  categorical: Record<string, CategoryCount[]>;
  ageGroup: CategoryCount[];
  sentiment: Record<string, CategoryCount[]>;
}

// ------------------------------------------------------------ product analytics
export interface GroupMetric {
  label: string; count: number; avgPrice: number; avgRating: number; avgReviews: number;
}
export interface ProductAnalytics {
  byBrand: GroupMetric[];
  byCategory: GroupMetric[];
  byStyle: GroupMetric[];
  priceRatingCrosstab: { bands: string[]; ratings: number[]; matrix: number[][] };
}

// -------------------------------------------------------------- market basket
export interface AssociationRule {
  antecedent: string; consequent: string;
  support: number; confidence: number; lift: number;
}
export interface MarketBasket {
  params: { minSupport: number; liftThreshold: number; sampleSize: number };
  ruleCount: number;
  rules: AssociationRule[];
  heatmap: { categories: string[]; styles: string[]; lift: (number | null)[][] };
}

// --------------------------------------------------------------------- models
export interface CorrectedMetrics {
  accuracy: number; precision: number; recall: number; f1: number;
  rocAuc: number | null; cvMean: number | null; cvStd: number | null;
}
export interface ModelTarget {
  key: string; label: string; description: string; note: string;
  positiveRate: number; baselineAccuracy: number;
  dissertationPca: Record<string, number>;
  reproductionPca: Record<string, number>;
  reproductionLda: Record<string, number>;
  corrected: Record<string, CorrectedMetrics>;
  headline: string;
  confusionMatrix: { labels: number[]; matrix: number[][] };
  roc: { model: string; points: { fpr: number; tpr: number }[]; auc: number | null };
}
export interface Models {
  sample: { size: number; split: string; randomState: number; reduction: { pca: number; lda: number } };
  modelOrder: string[];
  targets: ModelTarget[];
  featureImportance: { feature: string; importance: number }[];
}

// --------------------------------------------------------- client prediction model
export interface PredictionModel {
  target: string; targetLabel: string; type: string;
  trainAccuracy: number; trainRocAuc: number; baselineAccuracy: number;
  intercept: number;
  numericFeatures: { name: string; mean: number; std: number }[];
  categoricalFeatures: { name: string; options: string[] }[];
  coefficients: Record<string, number>;
  note: string;
}

export const overview = datasetOverview as DatasetOverview;
export const dist = distributions as Distributions;
export const products = productAnalytics as ProductAnalytics;
export const basket = marketBasket as MarketBasket;
export const ml = models as unknown as Models;
export const clientModel = predictionsModel as PredictionModel;
