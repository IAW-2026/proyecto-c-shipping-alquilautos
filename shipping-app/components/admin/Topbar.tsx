"use client";

import { UserButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { buscarReserva } from "@/app/actions/buscarReserva";
import EntregaModal from "@/components/admin/EntregasModal";
import { Search } from "lucide-react";

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [resultado, setResultado] = useState<any[]>([]);
  const [selectedEntrega, setSelectedEntrega] = useState<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  //cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setResultado([]);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResultado([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const entregas = await buscarReserva(query.trim());
      setResultado(entregas);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <div className="h-14 shrink-0 flex items-center justify-between px-6 bg-slate-950 min-w-0">
        {/* Input con dropdown */}
        <div
          ref={wrapperRef}
          className="relative min-w-0 w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          {/* Lupa */}
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ID de reserva..."
            className="bg-slate-900 pl-9 pr-3 py-1.5 rounded-lg w-full text-sm border border-slate-800 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
          />

          {/* Dropdown resultado */}
          {resultado.length > 0 && (
            <div className="absolute top-9 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl overflow-y-auto max-h-60 z-50 shadow-xl scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500">
              {resultado.map((entrega) => (
                <div
                  key={entrega.id}
                  onClick={() => {
                    setSelectedEntrega(entrega);
                    setResultado([]);
                    setQuery("");
                  }}
                  className="flex justify-between items-center px-4 py-3 hover:bg-slate-800/60 transition border-b border-slate-800 last:border-0 cursor-pointer"
                >
                  <span className="text-sm text-white font-medium">
                    Reserva #{entrega.id_reserva}
                  </span>
                  <span className="text-xs text-slate-400">
                    {entrega.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>

      {/* Modal */}
      {selectedEntrega && (
        <EntregaModal
          entrega={selectedEntrega}
          onClose={() => setSelectedEntrega(null)}
        />
      )}
    </>
  );
}
