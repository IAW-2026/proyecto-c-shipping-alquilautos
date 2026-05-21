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
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-80">
      <h2 className="mb-4 font-semibold">Actividad por dia de la semana</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line type="monotone" dataKey="entregas" stroke="#10b981" />

          <Line type="monotone" dataKey="devoluciones" stroke="#60a5fa" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
