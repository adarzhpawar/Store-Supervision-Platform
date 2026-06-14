import { Banknote, TrendingUp, Package, Users } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  subtext?: string;
  subtextColor?: "success" | "error" | "neutral";
  icon: "payments" | "monitoring" | "inventory_2" | "group";
  highlighted?: boolean;
};

const IconMap = {
  payments: Banknote,
  monitoring: TrendingUp,
  inventory_2: Package,
  group: Users,
};

export function MetricCard({
  title,
  value,
  subtext,
  subtextColor = "neutral",
  icon,
  highlighted = false,
}: MetricCardProps) {
  const IconComponent = IconMap[icon] || Package;

  return (
    <div className={`premium-card flex flex-col justify-between h-40 ${highlighted ? "bg-surface-container" : ""}`}>
      <div className="flex justify-between items-start">
        <span className="font-mono text-label-mono text-secondary uppercase tracking-widest">
          {title}
        </span>
        <IconComponent
          size={22}
          className={`${
            subtextColor === "success"
              ? "text-tertiary"
              : subtextColor === "error"
              ? "text-primary"
              : "text-outline"
          }`}
        />
      </div>
      <div className="flex items-end justify-between">
        <div className="font-headline text-headline-lg text-on-surface leading-none font-semibold">
          {value}
        </div>
        {subtext && (
          <span
            className={`font-mono text-label-mono flex items-center gap-0.5 ${
              subtextColor === "success"
                ? "text-tertiary"
                : subtextColor === "error"
                ? "text-primary"
                : "text-secondary"
            }`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
