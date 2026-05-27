import { prisma } from "@/lib/prisma";

import EntregasTable from "@/components/admin/EntregasTable";

export default async function EntregasPage() {
  const entregas = await prisma.entrega.findMany({
    include: {
      coordinaciones: true,
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Entregas</h1>

        <p className="text-sm text-slate-400 mt-1">
          Gestión y seguimiento de entregas y devoluciones.
        </p>
      </div>

      <EntregasTable entregas={entregas} />
    </div>
  );
}
