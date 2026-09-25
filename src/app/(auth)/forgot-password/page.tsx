"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    setMessage(data.message)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-celeste-100)] p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl border border-white/40">
        <h1 className="text-3xl font-bold text-gray-900">Olvidé mi contraseña</h1>
        <p className="mt-2 text-sm text-gray-500">Ingresá tu correo y te enviaremos un enlace para crear una nueva.</p>
        {message && <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" className="w-full rounded-xl border border-gray-200 px-4 py-3" />
          <button disabled={loading} className="w-full rounded-xl bg-teal-700 px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? "Enviando..." : "Enviar enlace"}</button>
        </form>
        <Link href="/login" className="mt-6 block text-center text-sm font-semibold text-teal-700 hover:underline">Volver al inicio de sesión</Link>
      </div>
    </main>
  )
}
