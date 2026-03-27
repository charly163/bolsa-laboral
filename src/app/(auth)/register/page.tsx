"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("POSTULANTE")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (res.ok) {
        router.push("/login")
      } else {
        const text = await res.text()
        setError(text || "Error al registrarse. Intenta nuevamente.")
      }
    } catch (err) {
      setError("Error interno. Verifica tu conexión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-100)] p-4 py-12">
      <div className="w-full max-w-lg glass p-8 rounded-2xl shadow-xl border border-white/40">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-celeste-600)] to-[var(--color-accent-500)] text-transparent bg-clip-text">
            Crea tu Cuenta
          </h1>
          <p className="text-gray-500 mt-2">Únete a la mejor red de talentos</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)] focus:border-transparent transition-all bg-white/80"
              placeholder="Ej: Laura Gómez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)] focus:border-transparent transition-all bg-white/80"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)] focus:border-transparent transition-all bg-white/80"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Qué buscas en la plataforma?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${role === 'POSTULANTE' ? 'border-[var(--color-celeste-500)] bg-[var(--color-celeste-50)] text-[var(--color-celeste-600)] font-semibold shadow-inner' : 'border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="POSTULANTE" checked={role === 'POSTULANTE'} onChange={() => setRole('POSTULANTE')} className="hidden" />
                Buscar Trabajo
              </label>
              <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${role === 'RECLUTADOR' ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-semibold shadow-inner' : 'border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="RECLUTADOR" checked={role === 'RECLUTADOR'} onChange={() => setRole('RECLUTADOR')} className="hidden" />
                Contratar Talento
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-accent-400)] to-[var(--color-primary-400)] hover:from-[var(--color-accent-500)] hover:to-[var(--color-primary-500)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--color-accent-100)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-primary-600)] hover:underline decoration-2 underline-offset-4">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
