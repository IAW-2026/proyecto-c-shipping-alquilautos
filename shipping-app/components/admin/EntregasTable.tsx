"use client";

import { useState } from "react";
import EntregaModal from "./EntregasModal";
import { STATUS_COLORS } from "@/lib/config/statusColors";

// función para mostrar tiempo relativo
function tiempoRelativo(fecha: Date): string {
  const ahora = new Date();
  const diff = Math.floor((ahora.getTime() - new Date(fecha).getTime()) / 1000);

  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 2592000) return `hace ${Math.floor(diff / 86400)} días`;
  return `hace ${Math.floor(diff / 2592000)} meses`;
}

interface Props {
  entregas: any[];
}

export default function EntregasTable({ entregas }: Props) {
  const [selectedEntrega, setSelectedEntrega] = useState<any>(null); //inicia sin entrega seleccionada (null)
  const [filtrosEstado, setFiltrosEstado] = useState<string[]>([]);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  //preprocesa cada entrega para no repetir la lógica en tabla y cards
  const entregasProcesadas = entregas
    .filter(
      (entrega) =>
        filtrosEstado.length === 0 || filtrosEstado.includes(entrega.estado),
    )
    .map((entrega) => ({
      ...entrega,
      status:
        STATUS_COLORS[entrega.estado as keyof typeof STATUS_COLORS].color.ui,
      entregaCoord: entrega.coordinaciones.find(
        (c: any) => c.tipo === "ENTREGA",
      ),
      devolucionCoord: entrega.coordinaciones.find(
        (c: any) => c.tipo === "DEVOLUCION",
      ),
    }));
  const ESTADOS = [...new Set(entregas.map((e) => e.estado))];
  return (
    <>
      {/* FILTROS */}
      <div className="relative inline-block mb-4">
        <button
          onClick={() => setDropdownAbierto((prev) => !prev)}
          className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-700 transition"
        >
          <span>
            {filtrosEstado.length === 0
              ? "Todos los estados"
              : `${filtrosEstado.length} estado${filtrosEstado.length > 1 ? "s" : ""}`}
          </span>
          <span className="text-slate-400">▾</span>
        </button>

        {dropdownAbierto && (
          <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 p-2 flex flex-col gap-1 min-w-[180px]">
            {ESTADOS.map((estado) => {
              const uiClass =
                STATUS_COLORS[estado as keyof typeof STATUS_COLORS].color.ui;
              const activeClass =
                STATUS_COLORS[estado as keyof typeof STATUS_COLORS].color
                  .active;
              const isActive = filtrosEstado.includes(estado);
              return (
                <button
                  key={estado}
                  onClick={() =>
                    setFiltrosEstado((prev) =>
                      isActive
                        ? prev.filter((e) => e !== estado)
                        : [...prev, estado],
                    )
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition cursor-pointer ${
                    isActive ? activeClass : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isActive ? activeClass : uiClass}`}
                  />
                  {STATUS_COLORS[estado as keyof typeof STATUS_COLORS].label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TABLA — solo desktop */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Fecha entrega</th>
              <th className="text-left p-4">Fecha devolución</th>
              <th className="text-left p-4">Última actualización</th>
            </tr>
          </thead>

          <tbody>
            {entregasProcesadas.map((entrega) => (
              <tr
                key={entrega.id}
                onClick={() => setSelectedEntrega(entrega)} //al hacer click en la fila selecciona esa entrega
                className="border-t border-slate-800 hover:bg-slate-800/40 transition cursor-pointer hover:scale-[1.01]"
              >
                {/*ID*/}
                <td className="p-4">
                  <span className="text-slate-400 font-mono text-xs">
                    #{entrega.id.slice(0, 8)}
                  </span>
                </td>

                {/* Estado */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${entrega.status}`}
                  >
                    {entrega.estado}
                  </span>
                </td>

                {/* Fecha entrega */}
                <td className="p-4">
                  {entrega.entregaCoord ? (
                    <div className="flex flex-col">
                      <span>
                        {new Date(
                          entrega.entregaCoord.fecha,
                        ).toLocaleDateString("es-AR", { timeZone: "UTC" })}
                      </span>
                      {entrega.entregaCoord?.hora_seleccionada && (
                        <span className="text-slate-500 text-xs">
                          {entrega.entregaCoord.hora_seleccionada} hs
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Fecha devolución */}
                <td className="p-4">
                  {entrega.devolucionCoord ? (
                    <div className="flex flex-col">
                      <span>
                        {new Date(
                          entrega.devolucionCoord.fecha,
                        ).toLocaleDateString("es-AR", { timeZone: "UTC" })}
                      </span>
                      {entrega.devolucionCoord?.hora_seleccionada && (
                        <span className="text-slate-500 text-xs">
                          {entrega.devolucionCoord.hora_seleccionada} hs
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Última actualización */}
                <td className="p-4 text-slate-400">
                  {tiempoRelativo(entrega.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS — solo móvil */}
      <div className="md:hidden space-y-3">
        {entregasProcesadas.map((entrega) => (
          <div
            key={entrega.id}
            onClick={() => setSelectedEntrega(entrega)} //al hacer click en la card selecciona esa entrega
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer hover:bg-slate-800/40 active:scale-[0.99] transition"
          >
            {/* Estado */}
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${entrega.status}`}
              >
                {entrega.estado}
              </span>
              <span className="text-slate-500 font-mono text-xs">
                #{entrega.id.slice(0, 8)}
              </span>
            </div>

            {/* Fechas y actualización con separadores */}
            <div className="divide-y divide-slate-800 mt-3">
              {/* Fecha entrega */}
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Entrega</span>
                <div className="flex flex-col items-end">
                  <span className="text-white">
                    {entrega.entregaCoord
                      ? new Date(entrega.entregaCoord.fecha).toLocaleDateString(
                          "es-AR",
                          { timeZone: "UTC" },
                        )
                      : "—"}
                  </span>
                  {entrega.entregaCoord?.hora_seleccionada && (
                    <span className="text-slate-500 text-xs">
                      {entrega.entregaCoord.hora_seleccionada} hs
                    </span>
                  )}
                </div>
              </div>

              {/* Fecha devolución */}
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Devolución</span>
                <div className="flex flex-col items-end">
                  <span className="text-white">
                    {entrega.devolucionCoord
                      ? new Date(
                          entrega.devolucionCoord.fecha,
                        ).toLocaleDateString("es-AR", { timeZone: "UTC" })
                      : "—"}
                  </span>
                  {entrega.devolucionCoord?.hora_seleccionada && (
                    <span className="text-slate-500 text-xs">
                      {entrega.devolucionCoord.hora_seleccionada} hs
                    </span>
                  )}
                </div>
              </div>

              {/* Última actualización */}
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Actualización</span>
                <span className="text-slate-400">
                  {tiempoRelativo(entrega.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedEntrega && (
        <EntregaModal
          entrega={selectedEntrega}
          onClose={() => setSelectedEntrega(null)}
        />
      )}
    </>
  );
}
