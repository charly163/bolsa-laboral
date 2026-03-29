import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProfileForm from "@/components/ProfileForm"

export default async function EditProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  })

  if (!user) {
    return <div>Usuario no encontrado</div>
  }

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { orderBy: { name: "asc" } },
    },
    orderBy: { name: "asc" },
  })

  const isRecruiter = user.role === "RECLUTADOR"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {isRecruiter ? "Configuración de Empresa" : "Configuración del Perfil"}
          </h1>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-[var(--color-primary-600)] transition-colors">
            ← Volver al Panel
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <ProfileForm user={user as any} categories={categories as any} />
        </div>
      </div>
    </div>
  )
}
