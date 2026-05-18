import { Truck, LayoutDashboard, Package } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4">
      <h1 className="text-xl font-bold mb-6">AlquilAutos</h1>

      <nav className="space-y-2">
        <div className="flex items-center gap-2 p-2 rounded bg-slate-800">
          <LayoutDashboard size={18} /> Dashboard
        </div>

        <div className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded">
          <Truck size={18} /> Entregas
        </div>

        <div className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded">
          <Package size={18} /> Coordinaciones
        </div>
      </nav>
    </div>
  );
}
