import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { createJob } from "@/app/actions/job"
import Link from "next/link"

export default async function NewJobPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "RECLUTADOR") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Publicar Nueva Oferta</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-[var(--color-primary-600)] transition-colors">
            ← Volver al Panel
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form action={createJob} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Puesto *</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Ej: Desarrollador Frontend Semi Senior"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa *</label>
                <input 
                  type="text" 
                  name="company" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Ej: TechCorp S.A."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Completa *</label>
              <textarea 
                name="description" 
                required
                rows={6} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                placeholder="Detalla las responsabilidades, requisitos y beneficios..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
                <select 
                  name="mode" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white text-gray-700"
                >
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="PRESENCIAL">Presencial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input 
                  type="text" 
                  name="location" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Ej: Madrid, España"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rango Salarial</label>
                <input 
                  type="text" 
                  name="salaryRange" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Ej: 30K - 40K USD"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Publicar Oferta
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
