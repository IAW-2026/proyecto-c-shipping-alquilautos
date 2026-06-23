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

    if (role !== "propietario" && role !== "adminSeller") {
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
          create: body.coordinaciones.map((c: any) => ({
            tipo: c.tipo.toUpperCase(), // "entrega" → "ENTREGA"
            fecha: c.fecha,
            hora_inicio_disponible: c.hora_inicio_disponible,
            hora_fin_disponible: c.hora_fin_disponible,
          })),
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
