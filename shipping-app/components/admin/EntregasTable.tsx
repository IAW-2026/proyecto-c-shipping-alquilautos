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
                      px-2 py-1 rounded-md text-xs font-medium

                      ${
                        entrega.estado === "PENDIENTE"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : ""
                      }

                      ${
                        entrega.estado === "COORDINADA"
                          ? "bg-blue-500/10 text-blue-400"
                          : ""
                      }

                      ${
                        entrega.estado === "ENTREGADO"
                          ? "bg-green-500/10 text-green-400"
                          : ""
                      }

                      ${
                        entrega.estado === "DEVUELTO"
                          ? "bg-slate-700 text-slate-300"
                          : ""
                      }

                      ${
                        entrega.estado === "CANCELADO"
                          ? "bg-red-500/10 text-red-400"
                          : ""
                      }
                    `}
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
