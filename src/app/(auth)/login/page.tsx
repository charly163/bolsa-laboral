"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciales inválidas. Intenta de nuevo.")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-celeste-100)] p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl border border-white/40">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-celeste-600)] to-[var(--color-primary-600)] text-transparent bg-clip-text">
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-500 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-celeste-500)] focus:border-transparent transition-all bg-white/80"
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
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-celeste-500)] focus:border-transparent transition-all bg-white/80"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-celeste-500)] to-[var(--color-primary-500)] hover:from-[var(--color-celeste-600)] hover:to-[var(--color-primary-600)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--color-celeste-100)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="font-semibold text-[var(--color-celeste-600)] hover:underline decoration-2 underline-offset-4">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
