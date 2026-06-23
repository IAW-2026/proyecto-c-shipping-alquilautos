/*consultar estado de una entrega   
  - puede acceder: buyer/seller
*/

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (
      role !== "alquilador" &&
      role !== "adminBuyer" &&
      role !== "propietario" &&
      role !== "adminSeller"
    ) {
      return Response.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Busca la entrega por id_reserva
    const entrega = await prisma.entrega.findUnique({
      where: {
        id_reserva: id,
      },
    });

    if (!entrega) {
      return Response.json({ error: "Entrega no encontrada" }, { status: 404 });
    }

    // Devuelve el estado actual de la entrega
    return Response.json({
      id_entrega: entrega.id,
      estado: entrega.estado,
      observaciones: entrega.observaciones,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error consultando entrega" },
      { status: 500 },
    );
  }
}

/*cancelar una entrega             
  - puede acceder: buyer/seller 
  - si se cancela y el estado es PENDIENTE (fue el buyer) -> avisar a seller
*/
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (
      role !== "alquilador" &&
      role !== "adminBuyer" &&
      role !== "propietario" &&
      role !== "adminSeller"
    ) {
      return Response.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Busca la entrega usando el id_reserva
    const entrega = await prisma.entrega.findUnique({
      where: {
        id_reserva: id,
      },
    });

    if (!entrega) {
      return Response.json({ error: "Entrega no encontrada" }, { status: 404 });
    }

    const estadoAnterior = entrega.estado;
    if (entrega.estado === "DEVUELTO" || entrega.estado === "CANCELADO") {
      return Response.json(
        { error: "No se puede cancelar una entrega devuelta" },
        { status: 400 },
      );
    }

    //actualiza estado entrega
    await prisma.entrega.update({
      where: {
        id: entrega.id,
      },

      data: {
        estado: "CANCELADO",
      },
    });

    //actualiza estado coordinaciones de la entrega
    await prisma.coordinacion.updateMany({
      where: {
        id_entrega: entrega.id,
      },

      data: {
        estado: "CANCELADA",
      },
    });

    //crea nuevo registro en la tabla HistorialEstado
    await prisma.historialEstado.create({
      data: {
        id_entrega: entrega.id,
        estado: "CANCELADO",
        descripcion: "Entrega cancelada",
      },
    });

    //notificar a seller (cancelo buyer)
    if (estadoAnterior === "PENDIENTE") {
      //obtengo token de la sesion actual
      const { getToken } = await auth();
      const token = await getToken();
      await fetch(`${process.env.SELLER_APP_URL}/api/reserva/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //envio el token
        },
        body: JSON.stringify({
          estado: "Cancelada",
        }),
      });
    }

    return Response.json({
      id_reserva: entrega.id_reserva,
      id_entrega: entrega.id,
      estado: "CANCELADO",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error cancelando entrega" },
      { status: 500 },
    );
  }
}
