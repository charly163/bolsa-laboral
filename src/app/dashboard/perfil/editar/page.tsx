import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { updateProfile } from "@/app/actions/profile"
import Link from "next/link"

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Perfil</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-[var(--color-primary-600)] transition-colors">
            ← Volver al Panel
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form action={updateProfile} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía Profesional
              </label>
              <textarea 
                name="bio"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-transparent transition-all"
                rows={5} 
                defaultValue={user.profile?.bio || ""}
                placeholder="Soy un desarrollador apasionado por crear soluciones escalables..."
              ></textarea>
              <p className="mt-2 text-xs text-gray-500">
                Escribe un resumen atractivo sobre ti. Esto es lo primero que verán los reclutadores.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currículum Vitae (Formato PDF)
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-primary-500)]">
                      <span>Seleccionar un archivo</span>
                      <input id="file-upload" name="cv" type="file" accept=".pdf" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Solo PDF hasta 5MB
                  </p>
                </div>
              </div>
              
              {user.profile?.cvUrl && (
                <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-green-500 font-bold">✓</span> Archivo actual: <a href={user.profile.cvUrl} target="_blank" className="underline text-[var(--color-celeste-600)]">Ver mi CV</a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] hover:scale-105 transition-transform"
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
