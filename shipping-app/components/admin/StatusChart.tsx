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
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 h-80 flex flex-col overflow-hidden">
      <h2 className="mb-2 font-semibold text-white">Estados de entrega</h2>

      {/* grafico donut */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              stroke="#0f172a"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* leyenda inferior */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 text-xs">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
