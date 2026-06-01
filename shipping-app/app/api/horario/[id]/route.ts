/*obtener horarios disponibles de una entrega 
  - puede acceder: buyer
*/
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    /* saco autenticacion para poder testear el endpoint con testDev
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "buyer") {
      return Response.json({ error: "No autorizado" }, { status: 403 });
    }
    */
    const { id } = await params;

    // Busca la entrega por id_reserva
    const entrega = await prisma.entrega.findUnique({
      where: {
        id_reserva: id,
      },

      include: {
        coordinaciones: true,
      },
    });

    if (!entrega) {
      return Response.json({ error: "Entrega no encontrada" }, { status: 404 });
    }

    return Response.json({
      id_reserva: entrega.id_reserva,
      id_entrega: entrega.id,

      horarios: entrega.coordinaciones.map((coordinacion) => ({
        tipo: coordinacion.tipo.toLowerCase(),
        fecha: coordinacion.fecha,
        hora_inicio_disponible: coordinacion.hora_inicio_disponible,
        hora_fin_disponible: coordinacion.hora_fin_disponible,
      })),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error obteniendo horarios" },
      { status: 500 },
    );
  }
}
