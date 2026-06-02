import { ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  title: string;
  value: number;
  change?: number;
}

export default function StatCard({ title, value, change }: Props) {
  const isPositive = change !== undefined && change >= 0;
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-sm text-slate-400">{title}</p>

      <div className="text-2xl font-bold mt-2">{value}</div>
      {change !== undefined && (
        <div
          className={`text-xs mt-2 flex items-center gap-1 ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}

          <span>
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </span>

          <span className="text-slate-500 ml-1">vs semana anterior</span>
        </div>
      )}
    </div>
  );
}
