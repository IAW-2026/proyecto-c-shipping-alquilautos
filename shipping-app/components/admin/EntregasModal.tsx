"use client";

import { useTransition } from "react";
import { marcarComoEntregado } from "@/app/actions/entrega";

interface Props {
  entrega: any;
  onClose: () => void;
}

export default function EntregaModal({ entrega, onClose }: Props) {
  const [pending, startTransition] = useTransition();

  const coordEntrega = entrega.coordinaciones.find(
    (c: any) => c.tipo === "ENTREGA",
  );

  //fecha-hora actual
  const ahora = new Date();

  //fecha-hora de la entrega (junto fecha con hora)
  const fechaHoraEntrega = new Date(coordEntrega.fecha);
  const [h, m] = coordEntrega.hora_seleccionada.split(":");
  fechaHoraEntrega.setHours(Number(h), Number(m), 0, 0);

  const puedeEntregar =
    entrega.estado === "COORDINADA" && ahora >= fechaHoraEntrega;

  const handleEntregar = () => {
    startTransition(async () => {
      try {
        await marcarComoEntregado(entrega.id);
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
        </div>
      </div>
    </div>
  );
}
