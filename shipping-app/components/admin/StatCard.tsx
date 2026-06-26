import {
  ChevronDown,
  ChevronUp,
  Minus,
  Truck,
  RotateCcw,
  Clock,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Variation = number | undefined;

function variationTone(variation: Variation) {
  if (variation === undefined)
    return "text-slate-400 bg-slate-800 ring-slate-700";
  if (variation >= 0) return "text-green-400 bg-green-400/10 ring-green-400/25";
  return "text-red-400 bg-red-400/10 ring-red-400/25";
}

function VariationIcon({ variation }: { variation: Variation }) {
  if (variation === undefined)
    return <Minus className="size-3.5 shrink-0" strokeWidth={2.5} />;
  return variation >= 0 ? (
    <ChevronUp className="size-3.5 shrink-0" strokeWidth={2.75} />
  ) : (
    <ChevronDown className="size-3.5 shrink-0" strokeWidth={2.75} />
  );
}

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  change?: number;
  icon?: LucideIcon;
  iconTone?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconTone = "bg-slate-700 text-slate-300 ring-slate-600",
}: Props) {
  const tone = variationTone(change);
  const variationLabel =
    change === undefined
      ? "—"
      : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-slate-900 p-5 ring-1 ring-slate-800 min-h-[160px] flex flex-col">
      {Icon && (
        <div
          className={`absolute right-5 top-5 grid size-10 place-items-center rounded-2xl ring-1 ${iconTone}`}
        >
          <Icon className="size-5" strokeWidth={2.1} />
        </div>
      )}

      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 pr-16 min-h-[2rem]">
        {title}
      </p>

      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="text-[2.6rem] font-semibold leading-none tracking-tight text-white">
            {value}
          </div>
          {subtitle && (
            <p className="mt-2.5 text-sm font-medium text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {change !== undefined && (
          <div className="mt-3 min-h-[32px] flex items-end">
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 ring-1 ${tone}`}
            >
              <VariationIcon variation={change} />
              <span
                className={`text-sm font-semibold ${
                  change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {variationLabel}
              </span>
              <span className="text-sm text-slate-500 whitespace-nowrap">
                vs semana anterior
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cards específicas ────────────────────────────────────────────

export function EntregasActivasCard(props: Omit<Props, "icon" | "iconTone">) {
  return (
    <StatCard
      {...props}
      icon={Truck}
      iconTone="bg-blue-500/10 text-blue-400 ring-blue-500/20"
    />
  );
}

export function DevolucionesCard(props: Omit<Props, "icon" | "iconTone">) {
  return (
    <StatCard
      {...props}
      icon={RotateCcw}
      iconTone="bg-rose-500/10 text-rose-400 ring-rose-500/20"
    />
  );
}

export function PendientesCard(props: Omit<Props, "icon" | "iconTone">) {
  return (
    <StatCard
      {...props}
      icon={Clock}
      iconTone="bg-amber-500/10 text-amber-400 ring-amber-500/20"
    />
  );
}

export function CanceladasCard(props: Omit<Props, "icon" | "iconTone">) {
  return (
    <StatCard
      {...props}
      icon={XCircle}
      iconTone="bg-rose-500/10 text-rose-400 ring-rose-500/20"
    />
  );
}

export default StatCard;
