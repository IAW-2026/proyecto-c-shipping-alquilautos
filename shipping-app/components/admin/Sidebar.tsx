"use client"; //porque agrego para que resalte el link en el que se encuentra

import Link from "next/link";

import { Truck, LayoutDashboard, Package } from "lucide-react"; //iconos de cada link

import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4">
      <h1 className="text-xl font-bold mb-6">AlquilAutos</h1>

      <nav className="space-y-2">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 p-2 rounded-lg border transition ${
            pathname === "/dashboard"
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
              : "border-transparent text-slate-300 hover:bg-slate-800"
          }`}
        >
          <LayoutDashboard
            size={18}
            className={
              pathname === "/dashboard" ? "text-cyan-400" : "text-slate-500"
            }
          />

          <span>Dashboard</span>
        </Link>

        {/* Entregas */}
        <Link
          href="/entregas"
          className={`flex items-center gap-2 p-2 rounded-lg border transition ${
            pathname === "/entregas"
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
              : "border-transparent text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Truck
            size={18}
            className={
              pathname === "/entregas" ? "text-cyan-400" : "text-slate-500"
            }
          />

          <span>Entregas</span>
        </Link>

        {/* Coordinaciones */}
        <Link
          href="/coordinaciones"
          className={`flex items-center gap-2 p-2 rounded-lg border transition ${
            pathname === "/coordinaciones"
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
              : "border-transparent text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Package
            size={18}
            className={
              pathname === "/coordinaciones"
                ? "text-cyan-400"
                : "text-slate-500"
            }
          />

          <span>Coordinaciones</span>
        </Link>
      </nav>
    </div>
  );
}
