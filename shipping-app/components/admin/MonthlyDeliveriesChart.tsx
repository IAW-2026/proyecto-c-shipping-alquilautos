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

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/60 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-white text-xl font-bold tabular-nums">
        {payload[0].value.toLocaleString("es-AR")}
        <span className="text-slate-400 text-sm font-normal ml-1">
          entregas
        </span>
      </p>
    </div>
  );
};

const CustomDot = (props: {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength?: number;
}) => {
  const { cx, cy, index, dataLength } = props;
  if (index !== (dataLength ?? 0) - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#22c55e" opacity={0.25} />
      <circle cx={cx} cy={cy} r={4} fill="#22c55e" />
      <circle cx={cx} cy={cy} r={2} fill="#fff" />
    </g>
  );
};

export default function MonthlyDeliveriesChart({
  data,
}: {
  data: { mes: string; entregas: number }[];
}) {
  const total = data.reduce((acc, d) => acc + d.entregas, 0);
  const lastMonth = data[data.length - 1];
  const prevMonth = data[data.length - 2];
  const delta =
    prevMonth && prevMonth.entregas > 0
      ? Math.round(
          ((lastMonth.entregas - prevMonth.entregas) / prevMonth.entregas) *
            100,
        )
      : null;

  const isPositive = delta !== null && delta >= 0;
  const dataWithLength = data.map((d, i) => ({ ...d, _len: data.length }));

  return (
    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">
            Últimos 3 meses
          </p>
          <h2 className="text-white text-lg font-bold leading-tight">
            Entregas totales
          </h2>
        </div>
        <div className="text-right">
          <p className="text-white text-2xl font-bold tabular-nums">
            {total.toLocaleString("es-AR")}
          </p>
          {delta !== null && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
                isPositive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {isPositive ? "▲" : "▼"} {Math.abs(delta)}% vs mes anterior
            </span>
          )}
        </div>
      </div>

      {/* Mini stat pills */}
      <div className="flex gap-3 mb-5">
        {data.map((d) => (
          <div
            key={d.mes}
            className="flex-1 bg-slate-800/50 rounded-lg px-3 py-2 text-center"
          >
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">
              {d.mes}
            </p>
            <p className="text-slate-200 text-sm font-bold tabular-nums mt-0.5">
              {d.entregas.toLocaleString("es-AR")}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dataWithLength}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="entregasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="mes"
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString("es-AR")}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#334155", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="entregas"
              stroke="#22c55e"
              strokeWidth={2.5}
              fill="url(#entregasGradient)"
              dot={(props) => (
                <CustomDot
                  key={`dot-${props.index}`}
                  cx={props.cx}
                  cy={props.cy}
                  index={props.index}
                  dataLength={data.length}
                />
              )}
              activeDot={{
                r: 5,
                fill: "#22c55e",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
