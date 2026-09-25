"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.get("token"), password }),
    })
    const data = await response.text()
    if (!response.ok) {
      setError(data)
      return
    }
    setMessage(data)
    setTimeout(() => router.push("/login"), 1500)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-celeste-100)] p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl border border-white/40">
        <h1 className="text-3xl font-bold text-gray-900">Nueva contraseña</h1>
        <p className="mt-2 text-sm text-gray-500">Elegí una contraseña de al menos 6 caracteres.</p>
        {error && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nueva contraseña" className="w-full rounded-xl border border-gray-200 px-4 py-3" />
          <button className="w-full rounded-xl bg-teal-700 px-4 py-3 font-bold text-white">Guardar contraseña</button>
        </form>
        <Link href="/login" className="mt-6 block text-center text-sm font-semibold text-teal-700 hover:underline">Volver al inicio de sesión</Link>
      </div>
    </main>
  )
}
