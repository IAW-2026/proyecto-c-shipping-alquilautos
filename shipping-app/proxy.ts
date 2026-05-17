import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  //Si la ruta NO es pública, obligamos a que el usuario esté autenticado
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    //en que rutas corre el middleware
    // Protege todas las rutas excepto _next y archivos estáticos
    "/((?!_next|.*\\..*).*)",
    // Siempre ejecuta para rutas de API
    "/api/(.*)",
  ],
};
