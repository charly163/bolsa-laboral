"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/profile"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  children: { id: string; name: string; slug: string }[]
}

interface ProfileFormProps {
  user: {
    id: string
    name: string | null
    role: string
    phone: string | null
    dni: string | null
    profile: {
      bio: string | null
      cvUrl: string | null
      categoryId: string | null
      companyName: string | null
      cuit: string | null
      address: string | null
      website: string | null
      companyDescription: string | null
    } | null
  }
  categories: Category[]
}

export default function ProfileForm({ user, categories }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const isRecruiter = user.role === "RECLUTADOR"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    if (result?.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "¡Cambios guardados exitosamente!" })
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* DNI / CUIL - for identification and verification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          DNI / CUIL *
        </label>
        <input
          name="dni"
          type="text"
          required
          defaultValue={user.dni || ""}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white font-mono"
          placeholder="Ej: 20-12345678-9"
        />
        <p className="mt-1 text-xs text-gray-500">
          Requerido para la validación manual por parte del administrador.
        </p>
      </div>

      {/* Phone - for everyone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono / WhatsApp *
        </label>
        <input
          name="phone"
          type="tel"
          required
          defaultValue={user.phone || ""}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
          placeholder="Ej: 11-2345-6789"
        />
        <p className="mt-1 text-xs text-gray-500">
          Este número será compartido cuando alguien use el botón "Contactar".
        </p>
      </div>

      {/* Category / Trade - for postulantes */}
      {!isRecruiter && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rubro / Oficio
            </label>
            <select
              name="categoryId"
              defaultValue={user.profile?.categoryId || ""}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white text-gray-700"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía Profesional
            </label>
            <textarea
              name="bio"
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-transparent transition-all"
              rows={5}
              defaultValue={user.profile?.bio || ""}
              placeholder="Soy electricista con 5 años de experiencia en instalaciones domiciliarias..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currículum Vitae (Formato PDF)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-primary-500)]">
                    <span>{loading ? "Procesando..." : "Seleccionar un archivo"}</span>
                    <input id="file-upload" name="cv" type="file" accept=".pdf" className="sr-only" disabled={loading} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Solo PDF hasta 5MB</p>
              </div>
            </div>
            {user.profile?.cvUrl && (
              <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span> Archivo actual:{" "}
                <a href={user.profile.cvUrl} target="_blank" className="underline text-[var(--color-celeste-600)]">
                  Ver mi CV
                </a>
              </div>
            )}
          </div>
        </>
      )}

      {/* Company fields - for recruiters */}
      {isRecruiter && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa *</label>
              <input
                name="companyName"
                type="text"
                required
                defaultValue={user.profile?.companyName || ""}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                placeholder="Ej: Instalaciones García S.R.L."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CUIT *</label>
              <input
                name="cuit"
                type="text"
                required
                defaultValue={user.profile?.cuit || ""}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                placeholder="Ej: 20-12345678-9"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              name="address"
              type="text"
              defaultValue={user.profile?.address || ""}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
              placeholder="Ej: Av. Rivadavia 1234, CABA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
            <input
              name="website"
              type="url"
              defaultValue={user.profile?.website || ""}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
              placeholder="Ej: https://www.miempresa.com.ar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción de la Empresa</label>
            <textarea
              name="companyDescription"
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-transparent transition-all"
              rows={4}
              defaultValue={user.profile?.companyDescription || ""}
              placeholder="Breve resumen de los servicios que ofrece su empresa..."
            ></textarea>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] hover:scale-105 transition-transform disabled:opacity-70 disabled:scale-100"
        >
          {loading ? "Guardando cambios..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  )
}
