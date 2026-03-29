"use client"

import { useState } from "react"
import { contactUser } from "@/app/actions/contact"

interface ContactModalProps {
  targetUserId: string
  targetName: string
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ targetUserId, targetName, isOpen, onClose }: ContactModalProps) {
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [contactInfo, setContactInfo] = useState<{
    name: string | null
    email: string | null
    phone: string | null
    companyName: string | null | undefined
  } | null>(null)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await contactUser(targetUserId, mensaje)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.success && result.contactInfo) {
      setContactInfo(result.contactInfo)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMensaje("")
    setContactInfo(null)
    setError("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 border border-gray-100">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!contactInfo ? (
          // Step 1: Write message
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Contactar a {targetName}</h3>
            <p className="text-sm text-gray-500 mb-6">
              Escribe un mensaje breve. Al enviar, podrás ver los datos de contacto.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Ej: Hola, vi tu perfil y me interesa contactarte para un trabajo de electricidad domiciliaria..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-transparent transition-all bg-gray-50 focus:bg-white text-sm"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-celeste-500)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Enviando..." : "Enviar y ver datos de contacto"}
              </button>
            </form>
          </>
        ) : (
          // Step 2: Show contact info
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">¡Contacto registrado!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Aquí están los datos de contacto de {contactInfo.name || targetName}
              </p>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              {contactInfo.companyName && (
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏢</span>
                  <div>
                    <p className="text-xs text-gray-500">Empresa</p>
                    <p className="text-sm font-semibold text-gray-900">{contactInfo.companyName}</p>
                  </div>
                </div>
              )}

              {contactInfo.email && (
                <div className="flex items-center gap-3">
                  <span className="text-lg">📧</span>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm font-semibold text-[var(--color-primary-600)] hover:underline"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-lg">📱</span>
                  <div>
                    <p className="text-xs text-gray-500">Teléfono / WhatsApp</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm font-semibold text-[var(--color-primary-600)] hover:underline"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="w-full mt-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
