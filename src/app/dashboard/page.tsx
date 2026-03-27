import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

import ApplyButton from "@/components/ApplyButton"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      profile: true,
      applications: true,
      jobsPosted: {
        orderBy: { createdAt: 'desc' },
        include: {
          applications: {
            include: { user: { include: { profile: true } } }
          }
        }
      }
    },
  })

  if (!user) {
    return <div>Usuario no encontrado</div>
  }

  const isRecruiter = user.role === "RECLUTADOR"

  const allJobs = !isRecruiter 
    ? await prisma.job.findMany({ 
        where: { status: "ACTIVA" }, 
        orderBy: { createdAt: "desc" },
        include: { recruiter: true }
      }) 
    : []

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-[var(--color-celeste-600)] to-[var(--color-primary-600)] text-transparent bg-clip-text">
                Bolsa Laboral
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700">
                Hola, {user.name} <span className="text-xs ml-2 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] px-2 py-1 rounded-full">{user.role}</span>
              </div>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
                <button type="submit" className="text-sm text-red-600 hover:text-red-800 font-medium font-semibold hover:underline">
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500 mt-1">
            {isRecruiter ? "Administra tus ofertas y encuentra talento." : "Gestiona tu perfil profesional y aplica a ofertas."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {isRecruiter ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Mis Ofertas Publicadas</h2>
                  <Link href="/dashboard/ofertas/nueva" className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                    + Nueva Oferta
                  </Link>
                </div>
                {user.jobsPosted.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">Aún no has publicado ninguna oferta.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.jobsPosted.map((job) => (
                      <div key={job.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{job.location || 'Remoto'} • {job.mode}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${job.status === 'ACTIVA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {job.status}
                          </span>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Postulantes ({job.applications.length})
                          </h4>
                          {job.applications.length > 0 ? (
                            <ul className="space-y-2">
                              {job.applications.map(app => (
                                <li key={app.id} className="text-sm bg-white p-2 rounded-lg border border-gray-100 flex justify-between items-center">
                                  <span className="font-medium text-gray-800">{app.user.name}</span>
                                  <div className="flex gap-3">
                                    {app.user.profile?.cvUrl && (
                                      <a href={app.user.profile.cvUrl} target="_blank" className="text-[var(--color-celeste-600)] underline text-xs font-bold">Ver CV</a>
                                    )}
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{app.status}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400">Nadie se ha postulado aún.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Explorar Empleos</h2>
                {allJobs.length === 0 ? (
                  <div className="text-center py-10 bg-[var(--color-celeste-50)] rounded-xl border-2 border-dashed border-[var(--color-celeste-200)]">
                    <p className="text-[var(--color-celeste-700)] font-medium">No hay ofertas disponibles en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allJobs.map((job) => {
                      const hasApplied = user.applications.some(app => app.jobId === job.id);
                      return (
                      <div key={job.id} className="p-5 border border-gray-100 rounded-xl hover:border-[var(--color-primary-300)] hover:shadow-lg transition-all bg-white relative group">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900 text-xl group-hover:text-[var(--color-primary-600)] transition-colors">{job.title}</h3>
                            <p className="text-sm font-semibold text-[var(--color-celeste-700)] mt-1">{job.company}</p>
                          </div>
                          <span className="px-3 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs font-bold rounded-lg border border-[var(--color-primary-100)]">
                            {job.mode}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                          <div className="text-xs text-gray-500 flex items-center gap-3">
                            <span>📍 {job.location || 'Remoto'}</span>
                            <span>💰 {job.salaryRange || 'No especificado'}</span>
                          </div>
                          <ApplyButton jobId={job.id} hasApplied={hasApplied} />
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar / Profile Area */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {isRecruiter ? "Perfil de Empresa" : "Mi Currículum"}
              </h2>
              
              {!isRecruiter && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biografía Profesional</label>
                    <textarea 
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl bg-gray-50"
                      rows={4} 
                      placeholder="Cuéntanos sobre tu experiencia..."
                      defaultValue={user.profile?.bio || ""}
                      readOnly
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currículum (PDF)</label>
                    {user.profile?.cvUrl ? (
                      <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-200 flex justify-between items-center">
                        <span>CV Subido Exitosamente</span>
                        <a href={user.profile.cvUrl} target="_blank" className="underline">Ver</a>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-xl border border-yellow-200">
                        Aún no subiste tu CV.
                      </div>
                    )}
                  </div>
                  <Link href="/dashboard/perfil/editar" className="block w-full text-center py-2 px-4 border border-[var(--color-celeste-200)] text-[var(--color-celeste-600)] font-semibold rounded-xl hover:bg-[var(--color-celeste-50)] transition-colors">
                    Editar Perfil
                  </Link>
                </div>
              )}
              
              {isRecruiter && (
                <div className="text-sm text-gray-600">
                  <p>Mantené la información de tu empresa actualizada para atraer a los mejores talentos.</p>
                  <Link href="/dashboard/perfil/editar" className="mt-4 block w-full text-center py-2 px-4 border border-[var(--color-primary-200)] text-[var(--color-primary-600)] font-semibold rounded-xl hover:bg-[var(--color-primary-50)] transition-colors">
                    Editar Empresa
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
