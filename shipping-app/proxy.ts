import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//rutas publicas
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized",
]);

export default clerkMiddleware(async (auth, request) => {
  //si la ruta es publica continua
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  //Si la ruta NO es pública, obligamos a que el usuario esté autenticado
  const { userId, redirectToSignIn } = await auth();

  //No autenticado
  if (!userId) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    //en que rutas corre el middleware
    // Protege todas las rutas excepto _next y archivos estáticos
    "/((?!_next|.*\\..*).*)",
  ],
};
