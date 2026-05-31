"use client";

import { useTransition } from "react";
import { marcarComoEntregado, marcarComoDevuelto } from "@/app/actions/entrega";
import { useRouter } from "next/navigation";
import { fromZonedTime } from "date-fns-tz";

const TZ = "America/Argentina/Buenos_Aires";
function parseFechaHoraArgentina(fecha: Date | string, horaStr: string): Date {
  const soloFecha =
    typeof fecha === "string"
      ? fecha.slice(0, 10)
      : fecha.toISOString().slice(0, 10);
  const isoSinZona = `${soloFecha}T${horaStr}:00`;
  return fromZonedTime(isoSinZona, TZ);
}

interface Props {
  entrega: any;
  onClose: () => void;
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

  //fecha-hora actual
  const ahora = new Date(); //client component toma fecha-hora del navegador

  //fecha-hora de la entrega (junto fecha con hora)
  const fechaHoraEntrega = parseFechaHoraArgentina(
    coordEntrega.fecha,
    coordEntrega.hora_seleccionada,
  );

  //fecha-hora de la devolucion (junto fecha con hora)
  const fechaHoraDevolucion = parseFechaHoraArgentina(
    coordDevolucion.fecha,
    coordDevolucion.hora_seleccionada,
  );

  const puedeEntregar =
    entrega.estado === "COORDINADA" && ahora >= fechaHoraEntrega;

  const puedeDevolver =
    entrega.estado === "ENTREGADO" && ahora >= fechaHoraDevolucion;

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-xl w-[400px] shadow-xl">
        <h2 className="text-lg font-bold mb-4">
          Reserva #{entrega.id_reserva}
        </h2>

        <p className="text-slate-300">
          Estado:{" "}
          <span className="text-white font-semibold">{entrega.estado}</span>
        </p>

        <p className="mt-2 text-slate-400">
          Entrega: {coordEntrega.hora_inicio_disponible} -{" "}
          {coordEntrega.hora_fin_disponible}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border border-slate-700 text-slate-300 rounded hover:bg-slate-800 cursor-pointer transition"
          >
            Cerrar
          </button>

          {puedeEntregar ? (
            <button
              onClick={handleEntregar}
              disabled={pending}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded cursor-pointer transition"
            >
              {pending ? "Procesando..." : "Marcar como ENTREGADO"}
            </button>
          ) : (
            <span className="text-sm text-gray-500">Aún no habilitado</span>
          )}

          {puedeDevolver && (
            <button
              onClick={handleDevolver}
              disabled={pending}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer transition"
            >
              {pending ? "Procesando..." : "Marcar como DEVUELTO"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
