"use client"; //porque agrego para que resalte el link en el que se encuentra

import Link from "next/link";

import { Truck, LayoutDashboard, Package } from "lucide-react";

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
          className={`flex items-center gap-2 p-2 rounded transition ${
            pathname === "/dashboard"
              ? "bg-slate-800 text-white"
              : "hover:bg-slate-800 text-slate-300"
          }`}
        >
          <LayoutDashboard size={18} />

          <span>Dashboard</span>
        </Link>

        {/* Entregas */}
        <Link
          href="/entregas"
          className={`flex items-center gap-2 p-2 rounded transition ${
            pathname === "/entregas"
              ? "bg-slate-800 text-white"
              : "hover:bg-slate-800 text-slate-300"
          }`}
        >
          <Truck size={18} />

          <span>Entregas</span>
        </Link>

        {/* Coordinaciones */}
        <Link
          href="/coordinaciones"
          className={`flex items-center gap-2 p-2 rounded transition ${
            pathname === "/coordinaciones"
              ? "bg-slate-800 text-white"
              : "hover:bg-slate-800 text-slate-300"
          }`}
        >
          <Package size={18} />

          <span>Coordinaciones</span>
        </Link>
      </nav>
    </div>
  );
}
