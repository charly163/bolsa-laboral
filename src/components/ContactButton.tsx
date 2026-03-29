"use client"

import { useState } from "react"
import ContactModal from "./ContactModal"

interface ContactButtonProps {
  userId: string
  userName: string
}

export default function ContactButton({ userId, userName }: ContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[var(--color-primary-600)] underline text-xs font-bold hover:text-[var(--color-primary-700)] transition-colors"
      >
        Contactar
      </button>

      <ContactModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetUserId={userId}
        targetName={userName}
      />
    </>
  )
}
