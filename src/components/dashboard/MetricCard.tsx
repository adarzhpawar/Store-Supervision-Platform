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
    <div className={`premium-card flex flex-col justify-between h-36 md:h-40 ${highlighted ? "bg-surface-container" : ""}`}>
      <div className="flex justify-between items-start gap-2">
        <span className="font-mono text-[10px] sm:text-xs text-secondary uppercase tracking-widest line-clamp-2">
          {title}
        </span>
        <IconComponent
          size={18}
          className={`flex-shrink-0 sm:w-[22px] sm:h-[22px] ${
            subtextColor === "success"
              ? "text-tertiary"
              : subtextColor === "error"
              ? "text-primary"
              : "text-outline"
          }`}
        />
      </div>
      <div className="flex items-end justify-between gap-2 mt-2">
        <div className="font-headline text-xl sm:text-2xl lg:text-3xl text-on-surface leading-none font-semibold truncate">
          {value}
        </div>
        {subtext && (
          <span
            className={`font-mono text-[10px] sm:text-xs flex-shrink-0 flex items-center gap-0.5 ${
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
