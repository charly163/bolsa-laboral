"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("No autenticado")
  }

  const bio = formData.get("bio") as string
  const file = formData.get("cv") as File | null

  let cvUrl = undefined

  if (file && file.size > 0) {
    if (file.type !== "application/pdf") {
      throw new Error("El archivo debe ser un PDF")
    }
    
    // Convertir a buffer y guardar en public/uploads
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (e) {
      // Ignorar error si ya existe
    }
    
    const fileName = `cv-${session.user.id}-${Date.now()}.pdf`
    const filePath = path.join(uploadsDir, fileName)
    
    await writeFile(filePath, buffer)
    cvUrl = `/uploads/${fileName}`
  }

  const updateData: any = {}
  if (bio !== null) updateData.bio = bio
  if (cvUrl !== undefined) updateData.cvUrl = cvUrl

  if (Object.keys(updateData).length > 0) {
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        ...updateData
      }
    })
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
