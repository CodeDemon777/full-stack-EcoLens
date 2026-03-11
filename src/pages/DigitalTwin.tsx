import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const baselineEmissions = 3100;

interface SliderParam {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
  reductionPerUnit: number; // tCO₂e reduction per unit increase
}

const params: SliderParam[] = [
  { id: "ev", label: "Fleet EV Transition", min: 0, max: 100, step: 5, unit: "%", defaultValue: 20, reductionPerUnit: 4 },
  { id: "renewable", label: "Renewable Energy Mix", min: 0, max: 100, step: 5, unit: "%", defaultValue: 30, reductionPerUnit: 6 },
  { id: "server", label: "Server Consolidation", min: 0, max: 100, step: 10, unit: "%", defaultValue: 10, reductionPerUnit: 2 },
  { id: "efficiency", label: "Building Efficiency", min: 0, max: 100, step: 5, unit: "%", defaultValue: 15, reductionPerUnit: 3 },
];

const DigitalTwin = () => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(params.map((p) => [p.id, p.defaultValue]))
  );

  const totalReduction = useMemo(() => {
    return params.reduce((sum, p) => sum + values[p.id] * p.reductionPerUnit, 0);
  }, [values]);

  const projectedEmissions = Math.max(0, baselineEmissions - totalReduction);

  const forecastData = useMemo(() => {
    const months = ["Now", "Q2", "Q3", "Q4", "Q1'27", "Q2'27"];
    return months.map((month, i) => {
      const baseDecline = baselineEmissions * (1 - 0.02 * i);
      const simDecline = projectedEmissions * (1 - 0.015 * i);
      return { month, baseline: Math.round(baseDecline), simulated: Math.round(simDecline) };
    });
  }, [projectedEmissions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Carbon Digital Twin</h1>
        <p className="text-sm text-muted-foreground">Simulate operational changes and see projected emission impacts in real-time</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Parameters */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold text-foreground mb-5">Operational Parameters</h3>
            <div className="space-y-6">
              {params.map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-foreground">{p.label}</label>
                    <span className="font-display text-sm font-bold text-primary">{values[p.id]}{p.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={values[p.id]}
                    onChange={(e) => setValues({ ...values, [p.id]: Number(e.target.value) })}
                    className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{p.min}{p.unit}</span>
                    <span>{p.max}{p.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result metric */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
            <p className="text-xs uppercase tracking-wider text-accent font-medium">Simulated Reduction</p>
            <p className="font-display text-4xl font-bold text-foreground mt-2">{totalReduction.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">tCO₂e per year</p>
            <p className="mt-2 text-sm text-accent">
              {projectedEmissions.toLocaleString()} tCO₂e projected (from {baselineEmissions.toLocaleString()} baseline)
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Emission Forecast Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210, 10%, 65%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(210, 10%, 65%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(207, 71%, 53%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(207, 71%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(210, 8%, 28%)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(210, 9%, 27%)", border: "1px solid hsl(210, 8%, 35%)", borderRadius: 8, color: "hsl(210, 17%, 98%)" }} />
              <Area type="monotone" dataKey="baseline" stroke="hsl(210, 10%, 65%)" fill="url(#baseGrad)" strokeWidth={2} strokeDasharray="6 3" name="Baseline" />
              <Area type="monotone" dataKey="simulated" stroke="hsl(207, 71%, 53%)" fill="url(#simGrad)" strokeWidth={2} name="Simulated" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-6 bg-muted-foreground" style={{ borderTop: "2px dashed hsl(210, 10%, 65%)" }} />
              <span className="text-xs text-muted-foreground">Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-future-blue" />
              <span className="text-xs text-muted-foreground">Simulated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
