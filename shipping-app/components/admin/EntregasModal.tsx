"use client";

import { useTransition } from "react";
import { marcarComoEntregado, marcarComoDevuelto } from "@/app/actions/entrega";
import { useRouter } from "next/navigation";
import { fromZonedTime } from "date-fns-tz";

const TZ = "America/Argentina/Buenos_Aires";

interface Props {
  entrega: any;
  onClose: () => void;
}

function parseFechaHoraArgentina(fecha: Date | string, horaStr: string): Date {
  const soloFecha =
    typeof fecha === "string"
      ? fecha.slice(0, 10)
      : fecha.toISOString().slice(0, 10);
  const isoSinZona = `${soloFecha}T${horaStr}:00`;
  return fromZonedTime(isoSinZona, TZ);
}

export default function EntregaModal({ entrega, onClose }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const coordEntrega = entrega.coordinaciones.find(
    (c: any) => c.tipo === "ENTREGA",
  );
  const coordDevolucion = entrega.coordinaciones.find(
    (c: any) => c.tipo === "DEVOLUCION",
  );

  const ahora = new Date();

  const fechaHoraEntrega = parseFechaHoraArgentina(
    coordEntrega.fecha,
    coordEntrega.hora_seleccionada,
  );
  const fechaHoraDevolucion = parseFechaHoraArgentina(
    coordDevolucion.fecha,
    coordDevolucion.hora_seleccionada,
  );

  const puedeEntregar =
    entrega.estado === "COORDINADA" && ahora >= fechaHoraEntrega;
  const puedeDevolver =
    entrega.estado === "ENTREGADO" && ahora >= fechaHoraDevolucion;

  const coordActual =
    entrega.estado !== "PENDIENTE"
      ? entrega.estado === "COORDINADA"
        ? coordEntrega
        : coordDevolucion
      : null;
  const labelActual =
    entrega.estado === "COORDINADA" ? "Entrega" : "Devolución";

  const handleEntregar = () => {
    startTransition(async () => {
      try {
        await marcarComoEntregado(entrega.id);
        router.refresh();
        onClose();
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const handleDevolver = () => {
    startTransition(async () => {
      try {
        await marcarComoDevuelto(entrega.id);
        router.refresh();
        onClose();
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-slate-900 border border-slate-700/50 text-slate-100 p-7 rounded-2xl w-[420px] max-w-[calc(100vw-2rem)] shadow-2xl shadow-black/40">
        {/* X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">
            Reserva
          </p>
          <h2 className="text-2xl font-bold text-white break-all">
            #{entrega.id_reserva}
          </h2>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-7">
          <div className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-3">
            <span className="text-sm text-slate-400">Estado</span>
            <span className="text-sm font-semibold text-white">
              {entrega.estado}
            </span>
          </div>

          {coordActual && (
            <div className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-3">
              <span className="text-sm text-slate-400">{labelActual}</span>
              <span className="text-sm font-semibold text-white">
                {coordActual.hora_seleccionada}
              </span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          {puedeEntregar ? (
            <button
              onClick={handleEntregar}
              disabled={pending}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              {pending ? "Procesando..." : "Marcar como entregado"}
            </button>
          ) : puedeDevolver ? (
            <button
              onClick={handleDevolver}
              disabled={pending}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-blue-900/30"
            >
              {pending ? "Procesando..." : "Marcar como devuelto"}
            </button>
          ) : (
            <span className="text-sm text-slate-500 self-center">
              Aún no habilitado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
