/*crear una entrega
  - puede acceder: seller
*/

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "seller") {
      return Response.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtiene el JSON enviado
    const body = await req.json();

    // Guarda una nueva entrega en la DB
    const entrega = await prisma.entrega.create({
      data: {
        id_reserva: body.id_reserva,
        id_vehiculo: body.id_vehiculo,
        id_propietario: body.id_propietario,
        id_alquilador: body.id_alquilador,
        observaciones: body.observaciones,

        coordinaciones: {
          create: [
            {
              tipo: "ENTREGA",
              hora_inicio_disponible: body.hora_inicio_entrega,
              hora_fin_disponible: body.hora_fin_entrega,
              fecha: body.fecha_inicio,
            },
            {
              tipo: "DEVOLUCION",
              hora_inicio_disponible: body.hora_inicio_devolucion,
              hora_fin_disponible: body.hora_fin_devolucion,
              fecha: body.fecha_fin,
            },
          ],
        },

        historial: {
          create: {
            estado: "PENDIENTE",
            descripcion: "Entrega creada",
          },
        },
      },
    });

    // Devuelve la entrega creada
    return Response.json(
      {
        id_entrega: entrega.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Error creando entrega" }, { status: 500 });
  }
}
