import { NextResponse } from "next/server";
import { getWeeklyDeliveriesComparison } from "@/lib/data/dashboard/getWeeklyDeliveriesComparison";

export async function GET() {
  const data = await getWeeklyDeliveriesComparison();
  return NextResponse.json(data);
}
