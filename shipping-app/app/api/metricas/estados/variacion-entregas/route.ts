import { NextResponse } from "next/server";
import { getWeeklyDeliveriesComparison } from "@/lib/data/dashboard/getWeeklyDeliveriesComparison";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    //autenticacion de usuario
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    //chequeo role
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "adminGlobal") {
      return Response.json({ error: "No autorizado" }, { status: 403 });
    }

    //obtengo los datos
    const data = await getWeeklyDeliveriesComparison();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error obteniendo la distribución de estados" },
      { status: 500 },
    );
  }
}
