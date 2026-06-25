import { NextResponse } from "next/server";
import { getWeeklyReturnsComparison } from "@/lib/data/dashboard/getWeeklyReturnsComparison";

export async function GET() {
  const data = await getWeeklyReturnsComparison();
  return NextResponse.json(data);
}
