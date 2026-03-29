"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ─── Verify a student ───

export async function verificarAlumno(userId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "No autorizado" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { verificadoCfp: true },
    })

    revalidatePath("/dashboard/admin")
    return { success: true }
  } catch (error) {
    console.error("VERIFY_ERROR:", error)
    return { error: "Error al verificar al alumno." }
  }
}

// ─── Unverify a student ───

export async function desverificarAlumno(userId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "No autorizado" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { verificadoCfp: false },
    })

    revalidatePath("/dashboard/admin")
    return { success: true }
  } catch (error) {
    console.error("UNVERIFY_ERROR:", error)
    return { error: "Error al desverificar al alumno." }
  }
}

// ─── Get all registered users (for admin panel) ───

export async function getAlumnos(filter?: "pendientes" | "verificados" | "todos") {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return []
  }

  const where: any = { role: "POSTULANTE" }

  if (filter === "pendientes") {
    where.verificadoCfp = false
  } else if (filter === "verificados") {
    where.verificadoCfp = true
  }

  return prisma.user.findMany({
    where,
    include: {
      profile: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

// ─── Get all companies (for admin panel) ───

export async function getEmpresas() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return []
  }

  return prisma.user.findMany({
    where: { role: "RECLUTADOR" },
    include: {
      profile: true,
      jobsPosted: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

// ─── Dashboard stats ───

export async function getDashboardStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return null
  }

  const [
    totalPostulantes,
    totalEmpresas,
    verificados,
    pendientes,
    totalOfertas,
    ofertasActivas,
    totalContactos,
    totalPostulaciones,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "POSTULANTE" } }),
    prisma.user.count({ where: { role: "RECLUTADOR" } }),
    prisma.user.count({ where: { role: "POSTULANTE", verificadoCfp: true } }),
    prisma.user.count({ where: { role: "POSTULANTE", verificadoCfp: false } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: "ACTIVA" } }),
    prisma.contactLog.count(),
    prisma.application.count(),
  ])

  return {
    totalPostulantes,
    totalEmpresas,
    verificados,
    pendientes,
    totalOfertas,
    ofertasActivas,
    totalContactos,
    totalPostulaciones,
  }
}

// ─── CRUD Categories ───

export async function createCategory(formData: FormData) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "No autorizado" }
  }

  const name = formData.get("name") as string
  const parentId = formData.get("parentId") as string | null

  if (!name) {
    return { error: "El nombre es requerido." }
  }

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
      },
    })

    revalidatePath("/dashboard/admin")
    return { success: true }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Ya existe una categoría con ese nombre." }
    }
    console.error("CREATE_CATEGORY_ERROR:", error)
    return { error: "Error al crear la categoría." }
  }
}

export async function deleteCategory(categoryId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "No autorizado" }
  }

  try {
    // Delete children first
    await prisma.category.deleteMany({ where: { parentId: categoryId } })
    await prisma.category.delete({ where: { id: categoryId } })

    revalidatePath("/dashboard/admin")
    return { success: true }
  } catch (error) {
    console.error("DELETE_CATEGORY_ERROR:", error)
    return { error: "Error al eliminar la categoría. Puede tener perfiles o empleos asociados." }
  }
}
