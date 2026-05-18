"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Pendiente", value: 10, color: "#22d3ee" },
  { name: "Coordinando", value: 8, color: "#34d399" },
  { name: "Entregado", value: 15, color: "#a78bfa" },
  { name: "En uso", value: 12, color: "#f59e0b" },
  { name: "Devuelto", value: 9, color: "#60a5fa" },
  { name: "Cancelado", value: 4, color: "#ef4444" },
];

export default function StatusChart() {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-80">
      <h2 className="mb-4 font-semibold">Estados de entrega</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
