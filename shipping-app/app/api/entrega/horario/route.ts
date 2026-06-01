/*confirmar horarios seleccionados de una entrega 
  - puede acceder: buyer
*/

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(req: Request) {
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

    const body = await req.json();

    // Busca la entrega usando el id_reserva
    const entrega = await prisma.entrega.findUnique({
      where: {
        id_reserva: body.id_reserva,
      },
    });

    if (!entrega) {
      return Response.json({ error: "Entrega no encontrada" }, { status: 404 });
    }

    //actualiza coordinaciones
    for (const horario of body.horarios) {
      await prisma.coordinacion.updateMany({
        where: {
          id_entrega: entrega.id,
          tipo: horario.tipo.toUpperCase(),
        },

        data: {
          hora_seleccionada: horario.hora_seleccionada,
          estado: "CONFIRMADA",
        },
      });
    }

    //actualiza estado entrega
    await prisma.entrega.update({
      where: {
        id: entrega.id,
      },

      data: {
        estado: "COORDINADA",
      },
    });

    //crea nuevo registro en la tabla HistorialEstado
    await prisma.historialEstado.create({
      data: {
        id_entrega: entrega.id,
        estado: "COORDINADA",
        descripcion: "Horarios confirmados por el comprador",
      },
    });
    /*

    //notificar a seller (va en etapa 3)
    await fetch(
      `${process.env.SELLER_APP_URL}/api/reserva/${body.id_reserva}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "COORDINADA",
        }),
      },
    );
    */

    return Response.json({
      id_reserva: entrega.id_reserva,
      id_entrega: entrega.id,
      estado: "COORDINADA",
      horarios: body.horarios,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error confirmando horarios" },
      { status: 500 },
    );
  }
}
