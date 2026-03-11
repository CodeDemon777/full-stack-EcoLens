import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, Truck, Server, Factory } from "lucide-react";

const recommendations = [
  {
    id: 1,
    title: "Accelerate Fleet Electrification to 50%",
    impact: "↓ 380 tCO₂e/year",
    priority: "High",
    category: "Transportation",
    icon: Truck,
    description: "Transitioning 50% of the diesel fleet to electric vehicles would reduce Scope 1 transportation emissions by approximately 380 tCO₂e annually. With current EV pricing trends and available tax incentives, the ROI period is estimated at 3.2 years.",
    actions: [
      "Prioritize short-range urban delivery routes for initial EV deployment",
      "Negotiate fleet EV procurement contracts with 2+ manufacturers",
      "Install Level 2 charging infrastructure at 3 primary depots",
      "Implement route optimization to maximize EV range efficiency",
    ],
  },
  {
    id: 2,
    title: "Switch to Renewable Energy PPA",
    impact: "↓ 620 tCO₂e/year",
    priority: "High",
    category: "Energy",
    icon: Zap,
    description: "A Power Purchase Agreement (PPA) for 80% renewable electricity would reduce Scope 2 emissions by 620 tCO₂e/year. Current market rates for wind/solar PPAs are competitive with grid prices in your operating regions.",
    actions: [
      "Issue RFP for 10-year renewable PPA with regional providers",
      "Evaluate on-site solar potential for HQ and warehouse facilities",
      "Negotiate green tariff options with current utility provider",
    ],
  },
  {
    id: 3,
    title: "Consolidate Server Infrastructure",
    impact: "↓ 180 tCO₂e/year",
    priority: "Medium",
    category: "IT Infrastructure",
    icon: Server,
    description: "Migrating from on-premise servers to a hyperscale cloud provider with verified carbon-neutral operations could reduce IT-related emissions by 180 tCO₂e annually while also reducing operational costs by an estimated 22%.",
    actions: [
      "Audit current server utilization (target: identify <30% utilized hardware)",
      "Develop cloud migration roadmap for non-critical workloads first",
      "Implement virtualization for remaining on-premise workloads",
    ],
  },
  {
    id: 4,
    title: "Optimize Supply Chain Logistics",
    impact: "↓ 240 tCO₂e/year",
    priority: "Medium",
    category: "Supply Chain",
    icon: Factory,
    description: "Restructuring supply chain routes and consolidating shipments could reduce Scope 3 logistics emissions. Implementing a supplier sustainability scorecard would also drive upstream emission reductions.",
    actions: [
      "Map and audit top 20 supplier emission profiles",
      "Consolidate inbound shipments with regional hub model",
      "Introduce sustainability KPIs into supplier contracts",
    ],
  },
];

const priorityColor: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-accent/10 text-accent border-accent/20",
  Low: "bg-muted text-muted-foreground border-border",
};

const Recommendations = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Recommendations</h1>
        <p className="text-sm text-muted-foreground">AI-driven optimization strategies ranked by impact potential</p>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all"
          >
            <button
              onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
              className="flex w-full items-center gap-4 px-6 py-5 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <rec.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-foreground">{rec.title}</p>
                <p className="text-xs text-primary font-medium">{rec.impact}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${priorityColor[rec.priority]}`}>
                {rec.priority}
              </span>
              {expanded === rec.id ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>
            {expanded === rec.id && (
              <div className="border-t border-border px-6 py-5 animate-slide-up">
                <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                <h4 className="mt-4 font-display text-xs font-semibold uppercase tracking-wider text-foreground">Action Steps</h4>
                <ul className="mt-2 space-y-2">
                  {rec.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
