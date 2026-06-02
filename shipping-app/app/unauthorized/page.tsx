import { SignOutButton } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-8 text-center shadow-xl">
        <div className="text-4xl mb-4">🔒</div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Acceso no autorizado
        </h1>

        <p className="text-slate-400 mb-6">
          Tu cuenta no tiene permisos de administrador para acceder a esta
          aplicación. Iniciá sesión con una cuenta autorizada.
        </p>

        <SignOutButton>
          <button className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all cursor-pointer shadow-md w-full">
            Cambiar de cuenta
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
