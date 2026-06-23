/* crear una entrega
  - puede acceder: seller
*/

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/app/generated/prisma";

function errorResponse({
  status,
  code,
  message,
  details,
}: {
  status: number;
  code: string;
  message: string;
  details?: any;
}) {
  return Response.json(
    {
      success: false,
      error: {
        code,
        message,
        details: details ?? null,
      },
    },
    { status },
  );
}

export async function POST(req: Request) {
  try {
    // autenticación
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return errorResponse({
        status: 401,
        code: "UNAUTHENTICATED",
        message: "No autenticado",
      });
    }

    // rol
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "propietario" && role !== "adminSeller") {
      return errorResponse({
        status: 403,
        code: "UNAUTHORIZED",
        message: "No autorizado para crear entregas",
      });
    }

    // body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return errorResponse({
        status: 400,
        code: "INVALID_JSON",
        message: "JSON inválido en el body",
      });
    }

    // validación mínima (evita errores de Prisma)
    const requiredFields = [
      "id_reserva",
      "id_vehiculo",
      "id_propietario",
      "id_alquilador",
      "coordinaciones",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return errorResponse({
          status: 400,
          code: "MISSING_FIELD",
          message: `Falta el campo requerido: ${field}`,
        });
      }
    }

    if (!Array.isArray(body.coordinaciones)) {
      return errorResponse({
        status: 400,
        code: "INVALID_FIELD_TYPE",
        message: "coordinaciones debe ser un array",
      });
    }

    // creación
    const entrega = await prisma.entrega.create({
      data: {
        id_reserva: body.id_reserva,
        id_vehiculo: body.id_vehiculo,
        id_propietario: body.id_propietario,
        id_alquilador: body.id_alquilador,
        observaciones: body.observaciones,

        coordinaciones: {
          create: body.coordinaciones.map((c: any) => ({
            tipo: c.tipo.toUpperCase(),
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

    return Response.json(
      {
        success: true,
        data: {
          id_entrega: entrega.id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    // errores de Prisma conocidos
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return errorResponse({
        status: 400,
        code: "PRISMA_ERROR",
        message: "Error de base de datos",
        details: {
          prismaCode: error.code,
          meta: error.meta,
        },
      });
    }

    return errorResponse({
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Error inesperado creando entrega",
    });
  }
}
