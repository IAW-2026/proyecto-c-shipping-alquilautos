"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    day: string;
    entregas: number;
    devoluciones: number;
  }[];
}

export default function DashboardChart({ data }: Props) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-80 flex flex-col justify-between overflow-hidden">
      <h2 className="mb-4 font-semibold text-white">
        Distribucion semanal de actividad
      </h2>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} accessibilityLayer>
          <defs>
            <linearGradient id="gradEntregas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradDevoluciones" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis dataKey="day" stroke="#64748b" />

          <YAxis stroke="#64748b" tickFormatter={(value) => `${value}%`} />

          <Tooltip
            formatter={(value) => `${value}%`}
            wrapperStyle={{ pointerEvents: "none", zIndex: 50 }}
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              borderRadius: "8px",
            }}
          />

          <Area
            type="monotone"
            dataKey="entregas"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradEntregas)"
            activeDot={{ r: 5, strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="devoluciones"
            stroke="#64748b"
            strokeWidth={2}
            fill="url(#gradDevoluciones)"
            activeDot={{ r: 5, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
