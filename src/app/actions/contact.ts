"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function contactUser(toUserId: string, mensaje: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: "Debes iniciar sesión para contactar." }
  }

  if (session.user.id === toUserId) {
    return { error: "No puedes contactarte a ti mismo." }
  }

  try {
    // Create contact log
    await prisma.contactLog.create({
      data: {
        fromUserId: session.user.id,
        toUserId: toUserId,
        mensaje: mensaje || null,
      },
    })

    // Fetch the target user's contact info
    const targetUser = await prisma.user.findUnique({
      where: { id: toUserId },
      select: {
        name: true,
        email: true,
        phone: true,
        profile: {
          select: {
            companyName: true,
          },
        },
      },
    })

    if (!targetUser) {
      return { error: "Usuario no encontrado." }
    }

    return {
      success: true,
      contactInfo: {
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        companyName: targetUser.profile?.companyName,
      },
    }
  } catch (error) {
    console.error("CONTACT_ERROR:", error)
    return { error: "Error al registrar el contacto." }
  }
}
