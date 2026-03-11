import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const forecastData = [
  { month: "Jan", actual: 3100, predicted: null },
  { month: "Feb", actual: null, predicted: 2950 },
  { month: "Mar", actual: null, predicted: 2820 },
  { month: "Apr", actual: null, predicted: 2710 },
];

const Predictions = () => {
  const [showTrend, setShowTrend] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Predictions</h1>
        <p className="text-sm text-muted-foreground">AI-driven emission forecasts based on operational patterns</p>
      </div>

      {/* Hero metric */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-10 text-center">
        <p className="text-xs uppercase tracking-wider text-accent font-medium mb-2">Projected Emissions — Next 90 Days</p>
        <p className="font-display text-6xl font-bold text-foreground">8,480</p>
        <p className="text-lg text-muted-foreground mt-1">tCO₂e</p>
        <p className="mt-3 text-sm text-accent">↓ 12.3% below baseline if current trajectory holds</p>
        <button
          onClick={() => setShowTrend(!showTrend)}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <TrendingUp className="h-4 w-4" />
          {showTrend ? "Hide" : "Show"} Trend Analysis
        </button>
      </div>

      {showTrend && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-slide-up">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Forecast vs Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(207, 71%, 53%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(207, 71%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(210, 8%, 28%)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(210, 9%, 27%)", border: "1px solid hsl(210, 8%, 35%)", borderRadius: 8, color: "hsl(210, 17%, 98%)" }} />
              <Area type="monotone" dataKey="actual" stroke="hsl(145, 63%, 49%)" fill="hsl(145, 63%, 49%)" fillOpacity={0.1} strokeWidth={2} name="Actual" connectNulls={false} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(207, 71%, 53%)" fill="url(#blueGrad)" strokeWidth={2} strokeDasharray="6 3" name="Predicted" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-signal-green" />
              <span className="text-xs text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-future-blue" />
              <span className="text-xs text-muted-foreground">AI Predicted</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Confidence</p>
          <p className="font-display text-2xl font-bold text-foreground mt-1">87%</p>
          <p className="text-xs text-muted-foreground">Model accuracy score</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Peak Month</p>
          <p className="font-display text-2xl font-bold text-foreground mt-1">July</p>
          <p className="text-xs text-destructive">Expected seasonal spike</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Annual Target</p>
          <p className="font-display text-2xl font-bold text-foreground mt-1">32,000</p>
          <p className="text-xs text-primary">On track ↓ 14%</p>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
