"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function applyToJob(jobId: string) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "POSTULANTE") {
    return { error: "Debes iniciar sesión como postulante para aplicar a ofertas." }
  }

  try {
    // Check if profile exists and has CV
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile || !profile.cvUrl) {
      return { error: "Debes subir tu Currículum en la pestaña 'Editar Perfil' antes de postularte." }
    }

    // Check if already applied
    const existingApp = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId: jobId
        }
      }
    })

    if (existingApp) {
      return { error: "Ya te has postulado a esta oferta." }
    }

    await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId: jobId,
        status: "RECIBIDA"
      }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("APPLY_ERROR:", error)
    return { error: "Ocurrió un error al procesar tu postulación." }
  }
}
