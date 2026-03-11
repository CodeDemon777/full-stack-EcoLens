import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const scope1Data = [
  { source: "Natural Gas", value: 520 },
  { source: "Diesel Fleet", value: 400 },
  { source: "Refrigerants", value: 85 },
  { source: "Company Vehicles", value: 65 },
];

const scope2Data = [
  { source: "Grid Electricity", value: 890 },
  { source: "Steam Purchase", value: 210 },
];

const scope3Data = [
  { source: "Purchased Materials", value: 770 },
  { source: "Business Travel", value: 310 },
  { source: "Employee Commute", value: 180 },
  { source: "Waste Disposal", value: 120 },
];

const tooltipStyle = { background: "hsl(210, 9%, 27%)", border: "1px solid hsl(210, 8%, 35%)", borderRadius: 8, color: "hsl(210, 17%, 98%)" };

const ScopeSection = ({ title, description, data, color }: { title: string; description: string; data: any[]; color: string }) => (
  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
    <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground mb-4">{description}</p>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid stroke="hsl(210, 8%, 28%)" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 12 }} axisLine={false} />
        <YAxis type="category" dataKey="source" tick={{ fill: "hsl(210, 10%, 65%)", fontSize: 11 }} axisLine={false} width={120} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ScopeAnalysis = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Scope Analysis</h1>
        <p className="text-sm text-muted-foreground">Detailed breakdown of emissions by scope category</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-primary font-medium">Scope 1</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">1,070</p>
          <p className="text-xs text-muted-foreground">tCO₂e — Direct emissions</p>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-accent font-medium">Scope 2</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">1,100</p>
          <p className="text-xs text-muted-foreground">tCO₂e — Purchased energy</p>
        </div>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-destructive font-medium">Scope 3</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">1,380</p>
          <p className="text-xs text-muted-foreground">tCO₂e — Value chain</p>
        </div>
      </div>

      <ScopeSection title="Scope 1 — Direct Emissions" description="Emissions from owned or controlled sources" data={scope1Data} color="hsl(145, 63%, 49%)" />
      <ScopeSection title="Scope 2 — Indirect Energy" description="Emissions from purchased electricity, steam, heating & cooling" data={scope2Data} color="hsl(207, 71%, 53%)" />
      <ScopeSection title="Scope 3 — Value Chain" description="All other indirect emissions in the value chain" data={scope3Data} color="hsl(36, 89%, 52%)" />
    </div>
  );
};

export default ScopeAnalysis;
