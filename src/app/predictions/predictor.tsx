"use client";

import { useMemo, useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PredictionModel } from "@/lib/artifacts";

const SENTIMENTS = [
  { label: "Positive", value: 0.25 },
  { label: "Neutral", value: 0 },
  { label: "Negative", value: -0.25 },
] as const;

const sliders = [
  { name: "Price", min: 10, max: 100, step: 1, prefix: "£", init: 55 },
  { name: "Review Count", min: 0, max: 499, step: 1, prefix: "", init: 250 },
  { name: "Age", min: 18, max: 64, step: 1, prefix: "", init: 41 },
] as const;

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

export function Predictor({ model }: { model: PredictionModel }) {
  const initialCats = Object.fromEntries(
    model.categoricalFeatures.map((f) => [f.name, f.options[0]]),
  );
  const initialNums: Record<string, number> = { Price: 55, "Review Count": 250, Age: 41 };

  const [nums, setNums] = useState<Record<string, number>>(initialNums);
  const [cats, setCats] = useState<Record<string, string>>(initialCats);
  const [sentiment, setSentiment] = useState<number>(0);

  const { prob, contributions } = useMemo(() => {
    let z = model.intercept;
    const contribs: { label: string; value: number }[] = [];

    for (const f of model.numericFeatures) {
      const raw = f.name.endsWith("_Polarity") ? sentiment : nums[f.name];
      if (raw === undefined) continue;
      const std = (raw - f.mean) / (f.std || 1);
      const c = (model.coefficients[f.name] ?? 0) * std;
      z += c;
      if (!f.name.endsWith("_Polarity")) contribs.push({ label: f.name, value: c });
    }
    let sentContrib = 0;
    for (const f of model.numericFeatures) {
      if (!f.name.endsWith("_Polarity")) continue;
      sentContrib += (model.coefficients[f.name] ?? 0) * ((sentiment - f.mean) / (f.std || 1));
    }
    contribs.push({ label: "Review sentiment", value: sentContrib });

    for (const f of model.categoricalFeatures) {
      const key = `${f.name}_${cats[f.name]}`;
      const c = model.coefficients[key] ?? 0; // baseline option → 0
      z += c;
      contribs.push({ label: `${f.name}: ${cats[f.name]}`, value: c });
    }

    return { prob: sigmoid(z), contributions: contribs.sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) };
  }, [model, nums, cats, sentiment]);

  const pct = prob * 100;
  const predicted = prob >= 0.5;
  const reset = () => {
    setNums(initialNums);
    setCats(initialCats);
    setSentiment(0);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      {/* Inputs */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-900">Product & shopper</h3>
          <Button variant="ghost" size="sm" onClick={reset} className="text-ink-500">
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {sliders.map((s) => (
            <label key={s.name} className="block">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-ink-700">{s.name}</span>
                <span className="text-sm tabular-nums text-ink-500">{s.prefix}{nums[s.name]}</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={nums[s.name]}
                onChange={(e) => setNums((p) => ({ ...p, [s.name]: Number(e.target.value) }))}
                className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-100 accent-steel-500"
              />
            </label>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            {model.categoricalFeatures.map((f) => (
              <label key={f.name} className="block">
                <span className="text-sm font-medium text-ink-700">{f.name}</span>
                <select
                  value={cats[f.name]}
                  onChange={(e) => setCats((p) => ({ ...p, [f.name]: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-ink-200 bg-surface px-3 py-2.5 text-sm text-ink-800 shadow-ring outline-none transition-colors focus:border-steel-400"
                >
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div>
            <span className="text-sm font-medium text-ink-700">Review sentiment</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SENTIMENTS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSentiment(s.value)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    sentiment === s.value
                      ? "border-steel-400 bg-steel-50 text-steel-700"
                      : "border-ink-200 bg-surface text-ink-600 hover:bg-ink-50",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Output */}
      <div className="flex flex-col gap-4">
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-500">Predicted: {model.targetLabel}</span>
            <Badge variant={predicted ? "success" : "neutral"} className="gap-1.5">
              <Sparkles className="size-3.5" />
              {predicted ? "Satisfied" : "Not satisfied"}
            </Badge>
          </div>
          <p className="mt-4 text-5xl font-semibold tabular-nums text-ink-900">{pct.toFixed(1)}%</p>
          <p className="mt-1 text-sm text-ink-500">probability of satisfaction</p>

          <div className="relative mt-6 h-3 rounded-full bg-ink-100">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-steel-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute -top-1 h-5 w-0.5 bg-ink-400"
              style={{ left: `${model.baselineAccuracy}%` }}
              title="Baseline"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink-400">
            <span>0%</span>
            <span>Baseline {model.baselineAccuracy.toFixed(0)}%</span>
            <span>100%</span>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <h3 className="text-sm font-semibold text-ink-900">Why this score</h3>
          <p className="mt-1 text-xs text-ink-500">Top contributions to the log-odds (± nudges the probability).</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {contributions.slice(0, 5).map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-ink-600">{c.label}</span>
                <span className={cn("tabular-nums", c.value >= 0 ? "text-teal-500" : "text-rose-500")}>
                  {c.value >= 0 ? "+" : ""}{c.value.toFixed(3)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
