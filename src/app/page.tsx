import { auth, signOut } from "@/auth"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[var(--color-primary-50)] via-[var(--color-celeste-100)] to-white">
      <div className="max-w-3xl glass p-10 py-16 rounded-3xl shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-700">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-celeste-600)] to-[var(--color-primary-600)] pb-2">
          La Bolsa de Trabajo del Futuro
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Conecta los mejores talentos con las empresas más innovadoras del mercado.
          Encuentra tu próximo desafío profesional hoy mismo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {session?.user ? (
            <>
              <div className="bg-white/70 px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-celeste-400)] to-[var(--color-primary-400)] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{session.user.name}</p>
                  <p className="text-xs text-gray-500">{session.user.role}</p>
                </div>
              </div>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="px-6 py-3 w-full sm:w-auto font-semibold rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100 hover:border-red-200"
                >
                  Cerrar Sesión
                </button>
              </form>
              <Link 
                href="/dashboard" 
                className="px-6 py-3 w-full sm:w-auto font-bold rounded-xl text-white bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] hover:scale-105 transition-transform shadow-lg shadow-[var(--color-primary-200)]"
              >
                Ir a mi Panel
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-3.5 w-full sm:w-auto font-bold rounded-xl text-[var(--color-primary-700)] bg-white hover:bg-gray-50 border-2 border-[var(--color-primary-200)] transition-all hover:border-[var(--color-primary-400)] shadow-sm"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="px-8 py-3.5 w-full sm:w-auto font-bold rounded-xl text-white bg-gradient-to-r from-[var(--color-celeste-500)] to-[var(--color-primary-500)] hover:from-[var(--color-celeste-600)] hover:to-[var(--color-primary-600)] transition-all transform hover:-translate-y-1 hover:shadow-xl shadow-lg shadow-[var(--color-celeste-200)]"
              >
                Crear una Cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
