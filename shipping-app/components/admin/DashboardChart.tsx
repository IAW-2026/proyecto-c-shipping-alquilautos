"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Lun", entregas: 20, devoluciones: 12 },
  { day: "Mar", entregas: 25, devoluciones: 15 },
  { day: "Mié", entregas: 22, devoluciones: 18 },
  { day: "Jue", entregas: 30, devoluciones: 20 },
  { day: "Vie", entregas: 38, devoluciones: 24 },
  { day: "Sáb", entregas: 42, devoluciones: 30 },
  { day: "Dom", entregas: 28, devoluciones: 27 },
];

export default function DashboardChart() {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-80">
      <h2 className="mb-4 font-semibold">Entregas vs devoluciones</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="entregas" stroke="#22c55e" />
          <Line type="monotone" dataKey="devoluciones" stroke="#38bdf8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
