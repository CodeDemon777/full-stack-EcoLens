import MetricCard from "@/components/MetricCard";
import { Factory, Zap, Truck, Server, TrendingDown, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const emissionsTrend = [
  { month: "Jul", emissions: 4200 },
  { month: "Aug", emissions: 3900 },
  { month: "Sep", emissions: 4100 },
  { month: "Oct", emissions: 3700 },
  { month: "Nov", emissions: 3500 },
  { month: "Dec", emissions: 3300 },
  { month: "Jan", emissions: 3100 },
];

const sourceBreakdown = [
  { source: "Energy", value: 1420, fill: "hsl(145, 63%, 49%)" },
  { source: "Transport", value: 890, fill: "hsl(207, 71%, 53%)" },
  { source: "IT Infra", value: 450, fill: "hsl(36, 89%, 52%)" },
  { source: "Supply Chain", value: 340, fill: "hsl(280, 60%, 55%)" },
];

const Overview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time carbon intelligence across your operations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Emissions"
          value="3,100"
          unit="tCO₂e"
          change="↓ 11.4% vs last month"
          changeType="positive"
          icon={<Factory className="h-5 w-5" />}
        />
        <MetricCard
          title="Energy Consumption"
          value="14.2"
          unit="GWh"
          change="↓ 3.2% vs last month"
          changeType="positive"
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          title="Fleet Emissions"
          value="890"
          unit="tCO₂e"
          change="↑ 2.1% vs last month"
          changeType="negative"
          icon={<Truck className="h-5 w-5" />}
        />
        <MetricCard
          title="Carbon Intensity"
          value="0.42"
          unit="tCO₂e/unit"
          change="On track for Q2 target"
          changeType="neutral"
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Emissions Trend */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-sm font-semibold text-foreground">Emissions Trend (6M)</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly total carbon emissions</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={emissionsTrend}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(145, 63%, 49%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(145, 63%, 49%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(210, 8%, 28%)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(210, 9%, 27%)", border: "1px solid hsl(210, 8%, 35%)", borderRadius: 8, color: "hsl(210, 17%, 98%)" }}
              />
              <Area type="monotone" dataKey="emissions" stroke="hsl(145, 63%, 49%)" fill="url(#greenGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Source Breakdown */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-sm font-semibold text-foreground">Emission Sources</h3>
          <p className="text-xs text-muted-foreground mb-4">Breakdown by operational category</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sourceBreakdown} layout="vertical">
              <CartesianGrid stroke="hsl(210, 8%, 28%)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
              <YAxis type="category" dataKey="source" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: "hsl(210, 9%, 27%)", border: "1px solid hsl(210, 8%, 35%)", borderRadius: 8, color: "hsl(210, 17%, 98%)" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {sourceBreakdown.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-green" />
        <span className="text-xs font-medium text-primary">All systems operational — Last sync: 2 minutes ago</span>
        <TrendingDown className="ml-auto h-4 w-4 text-primary" />
        <span className="text-xs text-primary">Net-zero trajectory: on track</span>
      </div>
    </div>
  );
};

export default Overview;
