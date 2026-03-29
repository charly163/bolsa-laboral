"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createJob(formData: FormData) {
  const session = await auth()

  if (!session?.user || session.user.role !== "RECLUTADOR") {
    throw new Error("No autorizado")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const company = formData.get("company") as string
  const location = formData.get("location") as string
  const salaryRange = formData.get("salaryRange") as string
  const mode = formData.get("mode") as "PRESENCIAL" | "HIBRIDO" | "REMOTO"
  const categoryId = formData.get("categoryId") as string

  if (!title || !description || !company) {
    throw new Error("Faltan campos obligatorios")
  }

  await prisma.job.create({
    data: {
      title,
      description,
      company,
      location,
      salaryRange,
      mode,
      categoryId: categoryId || null,
      recruiterId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateJob(jobId: string, formData: FormData) {
  const session = await auth()

  if (!session?.user || session.user.role !== "RECLUTADOR") {
    throw new Error("No autorizado")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const company = formData.get("company") as string
  const location = formData.get("location") as string
  const salaryRange = formData.get("salaryRange") as string
  const mode = formData.get("mode") as "PRESENCIAL" | "HIBRIDO" | "REMOTO"
  const categoryId = formData.get("categoryId") as string
  const status = formData.get("status") as "ACTIVA" | "CERRADA"

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job || job.recruiterId !== session.user.id) {
    throw new Error("No puedes editar esta oferta")
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      title,
      description,
      company,
      location,
      salaryRange,
      mode,
      categoryId: categoryId || null,
      status,
    },
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
