import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}

const MetricCard = ({ title, value, unit, change, changeType = "neutral", icon }: MetricCardProps) => {
  const changeColor =
    changeType === "positive"
      ? "text-primary"
      : changeType === "negative"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {change && (
            <p className={`mt-1 text-xs font-medium ${changeColor}`}>{change}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
