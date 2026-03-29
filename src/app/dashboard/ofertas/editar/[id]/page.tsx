import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { updateJob } from "@/app/actions/job"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session?.user || session.user.role !== "RECLUTADOR") {
    redirect("/dashboard")
  }

  const job = await prisma.job.findUnique({
    where: { id },
  })

  if (!job || job.recruiterId !== session.user.id) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { orderBy: { name: "asc" } },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Editar Oferta</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-[var(--color-primary-600)] transition-colors">
            ← Volver al Panel
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form action={updateJob.bind(null, job.id)} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Puesto *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={job.title}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa *</label>
                <input
                  type="text"
                  name="company"
                  required
                  defaultValue={job.company}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado de la Oferta</label>
              <select
                name="status"
                defaultValue={job.status}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white text-gray-700"
              >
                <option value="ACTIVA">Activa (Visible para todos)</option>
                <option value="CERRADA">Cerrada (Solo tú puedes verla)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Completa *</label>
              <textarea
                name="description"
                required
                rows={6}
                defaultValue={job.description}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rubro / Categoría</label>
              <select
                name="categoryId"
                defaultValue={job.categoryId || ""}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white text-gray-700"
              >
                <option value="">— Sin categoría —</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    <option value={cat.id}>{cat.name} (General)</option>
                    {cat.children.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
                <select
                  name="mode"
                  defaultValue={job.mode}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white text-gray-700"
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="REMOTO">Remoto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={job.location || ""}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rango Salarial</label>
                <input
                  type="text"
                  name="salaryRange"
                  defaultValue={job.salaryRange || ""}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <Link href="/dashboard" className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Guardar Cambios
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
