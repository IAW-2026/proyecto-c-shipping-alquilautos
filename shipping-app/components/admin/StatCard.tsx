interface Props {
  title: string;
  value: string;
  change: string;
}

export default function StatCard({ title, value, change }: Props) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-sm text-slate-400">{title}</p>

      <div className="text-2xl font-bold mt-2">{value}</div>

      <p className="text-xs mt-2 text-green-400">{change} vs semana anterior</p>
    </div>
  );
}
