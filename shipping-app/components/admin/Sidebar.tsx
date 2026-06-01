"use client"; //porque agrego para que resalte el link en el que se encuentra

import Link from "next/link";
import { Truck, LayoutDashboard, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/entregas", label: "Entregas", icon: Truck },
  { href: "/test", label: "TestDev", icon: Wrench },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar — solo visible en md en adelante */}
      <div
        className="hidden md:flex w-64 flex-col p-4
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
        border-r border-white/5
        shadow-xl
      "
      >
        <div className="flex items-center gap-3 mb-6 px-2 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Image
              src="/logo.png"
              alt="logo"
              width={60}
              height={60}
              className="w-10 h-10 object-contain"
            />
          </div>

          <h1 className="text-white font-semibold tracking-wide">
            ALQUILAUTOS
          </h1>
        </div>

        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2 p-2 rounded-lg border transition ${
                pathname === href
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : "border-transparent text-slate-300 hover:bg-slate-800"
              }`}
            >
              {pathname === href && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-400 rounded-r-full" />
              )}
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
