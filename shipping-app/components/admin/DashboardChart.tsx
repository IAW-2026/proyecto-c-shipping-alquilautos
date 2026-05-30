"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-80 flex flex-col justify-between">
      <h2 className="mb-4 font-semibold text-white">
        Distribucion semanal de actividad
      </h2>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} accessibilityLayer>
          <XAxis dataKey="day" stroke="#64748b" />

          <YAxis stroke="#64748b" tickFormatter={(value) => `${value}%`} />

          <Tooltip
            formatter={(value) => `${value}%`}
            wrapperStyle={{ pointerEvents: "none", zIndex: 50 }} // Evita que interfiera con el puntero y lo aísla
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              borderRadius: "8px",
            }} // Estilos oscuros para que combine con tu UI
          />

          <Line
            type="monotone"
            dataKey="entregas"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="devoluciones"
            stroke="#64748b"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
