//ruta raiz redirecciona:
// ->dashboard
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect("/dashboard");
}
