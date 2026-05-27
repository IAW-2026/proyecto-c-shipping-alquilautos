import { Truck, LayoutDashboard, Package } from "lucide-react";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4">
      <h1 className="text-xl font-bold mb-6">AlquilAutos</h1>

      <nav className="space-y-2">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 transition"
        >
          <LayoutDashboard size={18} />

          <span>Dashboard</span>
        </Link>

        {/* Entregas */}
        <Link
          href="/entregas"
          className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 transition"
        >
          <Truck size={18} />

          <span>Entregas</span>
        </Link>

        {/* Coordinaciones */}
        <Link
          href="/coordinaciones"
          className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 transition"
        >
          <Package size={18} />

          <span>Coordinaciones</span>
        </Link>
      </nav>
    </div>
  );
}
