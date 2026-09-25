"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const publicationTypeHelp = {
    OFERTA_LABORAL: "Busco una persona para contratar o incorporar a un trabajo.",
    SERVICIO_PROFESIONAL: "Ofrezco mis conocimientos o servicios, como electricidad o plomeria.",
    PRODUCTO: "Vendo o promociono algo que fabrico, como pastas caseras.",
    SOLICITUD_TRABAJO: "Necesito que alguien realice un trabajo especifico.",
} as const

export async function createPublication(formData: FormData) {
    const session = await auth()

    if (!session?.user) {
        throw new Error("Debes iniciar sesion para publicar")
    }

    const type = formData.get("type") as keyof typeof publicationTypeHelp
    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const categoryId = String(formData.get("categoryId") || "")

    if (!publicationTypeHelp[type] || !title || !description || !categoryId) {
        throw new Error("Completa el tipo, titulo, descripcion y categoria")
    }

    await prisma.publication.create({
        data: {
            type,
            title,
            description,
            categoryId,
            imageUrl: String(formData.get("imageUrl") || "") || null,
            price: String(formData.get("price") || "") || null,
            location: String(formData.get("location") || "") || null,
            mode: (formData.get("mode") as "PRESENCIAL" | "HIBRIDO" | "REMOTO") || "PRESENCIAL",
            authorId: session.user.id,
        },
    })

    revalidatePath("/dashboard")
    redirect("/dashboard")
}
