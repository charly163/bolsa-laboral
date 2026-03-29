"use client"

import { useState } from "react"
import VerifiedBadge from "./VerifiedBadge"
import ContactModal from "./ContactModal"

interface EgresadoCardProps {
  user: {
    id: string
    name: string | null
    verificadoCfp: boolean
    profile: {
      bio: string | null
      cvUrl: string | null
      category: { name: string } | null
    } | null
  }
}

export default function EgresadoCard({ user }: EgresadoCardProps) {
  const [showContact, setShowContact] = useState(false)

  return (
    <>
      <div className="bg-white p-5 rounded-xl border border-gray-100 hover:border-[var(--color-primary-300)] hover:shadow-lg transition-all group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-celeste-400)] to-[var(--color-primary-500)] flex items-center justify-center text-white font-bold text-lg shadow-inner flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-primary-600)] transition-colors">
                  {user.name}
                </h3>
                {user.verificadoCfp && <VerifiedBadge />}
              </div>
              {user.profile?.category && (
                <p className="text-sm text-[var(--color-celeste-600)] font-medium mt-0.5">
                  {user.profile.category.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {user.profile?.bio && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{user.profile.bio}</p>
        )}

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user.profile?.cvUrl && (
              <a
                href={user.profile.cvUrl}
                target="_blank"
                className="text-xs font-bold text-[var(--color-celeste-600)] hover:underline"
              >
                📄 Ver CV
              </a>
            )}
          </div>
          <button
            onClick={() => setShowContact(true)}
            className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-celeste-500)] text-white text-sm font-bold rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            Contactar
          </button>
        </div>
      </div>

      <ContactModal
        targetUserId={user.id}
        targetName={user.name || "Egresado"}
        isOpen={showContact}
        onClose={() => setShowContact(false)}
      />
    </>
  )
}
