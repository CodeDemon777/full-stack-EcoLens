import MetricCard from "@/components/MetricCard";
import { Factory, Flame, Zap, Link2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { month: "Aug", scope1: 1200, scope2: 1400, scope3: 1300 },
  { month: "Sep", scope1: 1150, scope2: 1380, scope3: 1570 },
  { month: "Oct", scope1: 1100, scope2: 1300, scope3: 1300 },
  { month: "Nov", scope1: 1050, scope2: 1250, scope3: 1200 },
  { month: "Dec", scope1: 980, scope2: 1200, scope3: 1120 },
  { month: "Jan", scope1: 920, scope2: 1100, scope3: 1080 },
];

const topEmitters = [
  { name: "Natural Gas Boilers", emissions: 520, category: "Scope 1" },
  { name: "Grid Electricity", emissions: 890, category: "Scope 2" },
  { name: "Diesel Fleet", emissions: 400, category: "Scope 1" },
  { name: "Business Travel", emissions: 310, category: "Scope 3" },
  { name: "Purchased Materials", emissions: 770, category: "Scope 3" },
];

const Emissions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Emissions</h1>
        <p className="text-sm text-muted-foreground">Comprehensive view of carbon emissions across all scopes</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard title="Scope 1 — Direct" value="920" unit="tCO₂e" change="↓ 6.1%" changeType="positive" icon={<Flame className="h-5 w-5" />} />
        <MetricCard title="Scope 2 — Energy" value="1,100" unit="tCO₂e" change="↓ 8.3%" changeType="positive" icon={<Zap className="h-5 w-5" />} />
        <MetricCard title="Scope 3 — Supply" value="1,080" unit="tCO₂e" change="↓ 3.6%" changeType="positive" icon={<Link2 className="h-5 w-5" />} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-display text-sm font-semibold text-foreground">Monthly Emissions by Scope</h3>
        <p className="text-xs text-muted-foreground mb-4">Stacked breakdown over the past 6 months</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid stroke="hsl(210, 8%, 28%)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(210, 9%, 27%)", border: "1px solid hsl(210, 8%, 35%)", borderRadius: 8, color: "hsl(210, 17%, 98%)" }} />
            <Legend wrapperStyle={{ color: "hsl(210, 10%, 65%)" }} />
            <Bar dataKey="scope1" name="Scope 1" fill="hsl(145, 63%, 49%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="scope2" name="Scope 2" fill="hsl(207, 71%, 53%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="scope3" name="Scope 3" fill="hsl(36, 89%, 52%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Top Emission Sources</h3>
        <div className="space-y-3">
          {topEmitters.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold text-foreground">{item.emissions}</p>
                <p className="text-xs text-muted-foreground">tCO₂e</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emissions;
