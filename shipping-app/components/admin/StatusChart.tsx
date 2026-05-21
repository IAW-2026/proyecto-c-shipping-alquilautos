"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export default function StatusChart({ data }: Props) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-80">
      <h2 className="mb-4 font-semibold">Estados de entrega</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90}>
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
