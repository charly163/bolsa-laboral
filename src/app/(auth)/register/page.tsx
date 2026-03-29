"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  children: { id: string; name: string; slug: string }[]
}

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("POSTULANTE")
  const [phone, setPhone] = useState("")
  const [dni, setDni] = useState("")
  const [categoryId, setCategoryId] = useState("")
  // Company fields
  const [companyName, setCompanyName] = useState("")
  const [cuit, setCuit] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const body: any = { name, email, password, role, phone, dni }

      if (role === "RECLUTADOR") {
        body.companyName = companyName
        body.cuit = cuit
      }

      if (categoryId) {
        body.categoryId = categoryId
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
          <p className="text-gray-500 mt-2">Únete a la mejor red de talentos y oficios</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
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
              Correo Electrónico *
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
              Contraseña *
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI / CUIL
              </label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)] focus:border-transparent transition-all bg-white/80"
                placeholder="Ej: 12345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)] focus:border-transparent transition-all bg-white/80"
                placeholder="Ej: 11-2345-6789"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Qué buscas en la plataforma? *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                  role === "POSTULANTE"
                    ? "border-[var(--color-celeste-500)] bg-[var(--color-celeste-50)] text-[var(--color-celeste-600)] font-semibold shadow-inner"
                    : "border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300"
                }`}
              >
                <input type="radio" name="role" value="POSTULANTE" checked={role === "POSTULANTE"} onChange={() => setRole("POSTULANTE")} className="hidden" />
                🔧 Buscar Trabajo
              </label>
              <label
                className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                  role === "RECLUTADOR"
                    ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-semibold shadow-inner"
                    : "border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300"
                }`}
              >
                <input type="radio" name="role" value="RECLUTADOR" checked={role === "RECLUTADOR"} onChange={() => setRole("RECLUTADOR")} className="hidden" />
                🏢 Contratar Talento
              </label>
            </div>
          </div>

          {/* Category selector for Postulante */}
          {role === "POSTULANTE" && categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rubro / Oficio
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)] focus:border-transparent transition-all bg-white/80"
              >
                <option value="">— Seleccionar rubro —</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    <option value={cat.id}>{cat.name} (General)</option>
                    {cat.children.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          {/* Company fields for Reclutador */}
          {role === "RECLUTADOR" && (
            <div className="space-y-4 p-4 bg-[var(--color-primary-50)] rounded-xl border border-[var(--color-primary-200)]">
              <h3 className="text-sm font-bold text-[var(--color-primary-700)]">Datos de la Empresa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre de Empresa *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-white text-sm"
                    placeholder="Ej: TechCorp S.A."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">CUIT *</label>
                  <input
                    type="text"
                    required
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-white text-sm"
                    placeholder="Ej: 20-12345678-9"
                  />
                </div>
              </div>
              {categories.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rubro de la Empresa</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-white text-sm"
                  >
                    <option value="">— Seleccionar rubro —</option>
                    {categories.map((cat) => (
                      <optgroup key={cat.id} label={cat.name}>
                        <option value={cat.id}>{cat.name} (General)</option>
                        {cat.children.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

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
