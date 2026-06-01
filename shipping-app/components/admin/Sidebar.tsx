"use client"; //porque agrego para que resalte el link en el que se encuentra

import Link from "next/link";
import { Truck, LayoutDashboard, Package } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/entregas", label: "Entregas", icon: Truck },
  { href: "/coordinaciones", label: "Coordinaciones", icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar — solo visible en md en adelante */}
      <div className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 p-4 flex-col">
        <h1 className="text-xl font-bold mb-6">AlquilAutos</h1>
        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                pathname === href
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : "border-transparent text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon
                size={18}
                className={
                  pathname === href ? "text-cyan-400" : "text-slate-500"
                }
              />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom nav — solo visible en móvil */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900 border-t border-slate-800 flex justify-around items-center h-16 px-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 text-xs transition ${
              pathname === href ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
