import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    //en que rutas corre el middleware
    // Protege todas las rutas excepto _next y archivos estáticos
    "/((?!_next|.*\\..*).*)",
    // Siempre ejecuta para rutas de API
    "/api/(.*)",
  ],
};
