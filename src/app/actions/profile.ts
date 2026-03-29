"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import cloudinary from "@/lib/cloudinary"

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return { error: "No autenticado" }
  }

  const bio = formData.get("bio") as string
  const phone = formData.get("phone") as string
  const dni = formData.get("dni") as string
  const categoryId = formData.get("categoryId") as string
  const file = formData.get("cv") as File | null

  // Company fields (only for RECLUTADOR)
  const companyName = formData.get("companyName") as string
  const cuit = formData.get("cuit") as string
  const address = formData.get("address") as string
  const website = formData.get("website") as string
  const companyDescription = formData.get("companyDescription") as string

  try {
    let cvUrl: string | undefined = undefined

    // Upload CV to Cloudinary if provided
    if (file && file.size > 0) {
      if (file.type !== "application/pdf") {
        return { error: "El archivo debe ser un PDF" }
      }

      if (file.size > 5 * 1024 * 1024) {
        return { error: "El archivo no puede superar los 5MB" }
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "bolsa-laboral/cvs",
            public_id: `cv-${session.user.id}-${Date.now()}`,
            format: "pdf",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(buffer)
      })

      cvUrl = result.secure_url
    }

    // Update User model fields (phone, dni)
    const userUpdateData: any = {}
    if (phone !== null && phone !== undefined) userUpdateData.phone = phone || null
    if (dni !== null && dni !== undefined) userUpdateData.dni = dni || null

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: userUpdateData,
      })
    }

    // Build profile update data
    const updateData: any = {}
    if (bio !== null) updateData.bio = bio
    if (cvUrl !== undefined) updateData.cvUrl = cvUrl
    if (categoryId) updateData.categoryId = categoryId
    if (companyName !== null) updateData.companyName = companyName || null
    if (cuit !== null) updateData.cuit = cuit || null
    if (address !== null) updateData.address = address || null
    if (website !== null) updateData.website = website || null
    if (companyDescription !== null) updateData.companyDescription = companyDescription || null

    if (Object.keys(updateData).length > 0) {
      await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: updateData,
        create: {
          userId: session.user.id,
          ...updateData,
        },
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/perfil/editar")
    return { success: true }
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR:", error)
    return { error: "Ocurrió un error al actualizar el perfil." }
  }
}
