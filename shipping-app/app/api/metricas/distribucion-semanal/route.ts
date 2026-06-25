import { NextResponse } from "next/server";
import { getDeliveryChartData } from "@/lib/data/dashboard/getDeliveryChartData";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json(
        { data: null, error: "No autenticado" },
        { status: 401 },
      );
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "adminGlobal") {
      return Response.json(
        { data: null, error: "No autorizado" },
        { status: 403 },
      );
    }

    //obtengo los datos
    const data = await getDeliveryChartData();
    return Response.json({
      data,
      error: null,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { data: null, error: "Error obteniendo la distribución de estados" },
      { status: 500 },
    );
  }
}
