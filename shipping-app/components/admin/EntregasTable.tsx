import { STATUS_COLORS } from "@/lib/config/statusColors";

interface Props {
  entregas: any[];
}

export default function EntregasTable({ entregas }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="text-left p-4">Estado</th>

            <th className="text-left p-4">Fecha entrega</th>

            <th className="text-left p-4">Fecha devolución</th>

            <th className="text-left p-4">Última actualización</th>
          </tr>
        </thead>

        <tbody>
          {entregas.map((entrega) => {
            const status =
              STATUS_COLORS[entrega.estado as keyof typeof STATUS_COLORS].color
                .ui;
            const entregaCoord = entrega.coordinaciones.find(
              (c: any) => c.tipo === "ENTREGA",
            );

            const devolucionCoord = entrega.coordinaciones.find(
              (c: any) => c.tipo === "DEVOLUCION",
            );

            return (
              <tr
                key={entrega.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                {/* Estado */}
                <td className="p-4">
                  <span
                    className={`
                      px-2 py-1 rounded-md text-xs font-medium ${status}`}
                  >
                    {entrega.estado}
                  </span>
                </td>

                {/* Fecha entrega */}
                <td className="p-4">
                  {entregaCoord ? (
                    new Date(entregaCoord.fecha).toLocaleDateString()
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Fecha devolución */}
                <td className="p-4">
                  {devolucionCoord ? (
                    new Date(devolucionCoord.fecha).toLocaleDateString()
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Última actualización */}
                <td className="p-4 text-slate-400">
                  {new Date(entrega.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
