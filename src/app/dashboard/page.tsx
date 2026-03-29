import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

import JobBoard from "@/components/JobBoard"
import VerifiedBadge from "@/components/VerifiedBadge"
import ContactButton from "@/components/ContactButton"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: { category: true },
      },
      applications: {
        include: {
          job: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      jobsPosted: {
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          applications: {
            include: { user: { include: { profile: true } } },
          },
        },
      },
      contactsTo: {
        orderBy: { createdAt: "desc" },
        include: {
          fromUser: {
            include: { profile: true },
          },
        },
      },
    },
  })

  if (!user) {
    return <div>Usuario no encontrado</div>
  }

  const isRecruiter = user.role === "RECLUTADOR"
  const isAdmin = user.role === "ADMIN"

  // Fetch jobs and categories for postulantes
  const allJobs = !isRecruiter
    ? await prisma.job.findMany({
        where: { status: "ACTIVA" },
        orderBy: { createdAt: "desc" },
        include: {
          recruiter: { select: { name: true, verificadoCfp: true } },
          category: true,
        },
      })
    : []

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { orderBy: { name: "asc" } },
    },
    orderBy: { name: "asc" },
  })

  // Fetch verified egresados for "Tablón Inverso"
  const verifiedEgresados = !isRecruiter
    ? await prisma.user.findMany({
        where: {
          role: "POSTULANTE",
          verificadoCfp: true,
        },
        include: {
          profile: {
            include: { category: true },
          },
        },
        take: 20,
      })
    : []

  const userApplicationJobIds = user.applications.map((app) => app.jobId)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-[var(--color-celeste-600)] to-[var(--color-primary-600)] text-transparent bg-clip-text"
              >
                Bolsa Laboral
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  Panel Admin
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Hola, {user.name}
                </span>
                <span className="text-xs bg-[var(--color-primary-100)] text-[var(--color-primary-700)] px-2 py-1 rounded-full font-semibold">
                  {user.role}
                </span>
                {user.verificadoCfp && <VerifiedBadge />}
              </div>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
                <button type="submit" className="text-sm text-red-600 hover:text-red-800 font-semibold hover:underline">
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
            {isRecruiter
              ? "Administra tus ofertas y encuentra talento."
              : "Gestiona tu perfil profesional y aplica a ofertas."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {isRecruiter ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Mis Ofertas Publicadas</h2>
                  <Link
                    href="/dashboard/ofertas/nueva"
                    className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
                  >
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
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                              {job.category && (
                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100 font-medium">
                                  {job.category.name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{job.location || "Remoto"} • {job.mode}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${job.status === "ACTIVA" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {job.status}
                            </span>
                            <Link
                              href={`/dashboard/ofertas/editar/${job.id}`}
                              className="text-xs font-bold text-gray-500 hover:text-[var(--color-primary-600)] underline"
                            >
                              Editar
                            </Link>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Postulantes ({job.applications.length})
                          </h4>
                          {job.applications.length > 0 ? (
                            <ul className="space-y-2">
                              {job.applications.map((app) => (
                                <li key={app.id} className="text-sm bg-white p-2 rounded-lg border border-gray-100 flex justify-between items-center px-3">
                                  <span className="font-medium text-gray-800">{app.user.name}</span>
                                  <div className="flex gap-4 items-center">
                                    {app.user.profile?.cvUrl && (
                                      <a href={app.user.profile.cvUrl} target="_blank" className="text-[var(--color-celeste-600)] underline text-xs font-bold">
                                        Ver CV
                                      </a>
                                    )}
                                    <ContactButton userId={app.user.id} userName={app.user.name || "Postulante"} />
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">{app.status}</span>
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
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Explorar Empleos</h2>
                  <JobBoard
                    jobs={allJobs as any}
                    egresados={verifiedEgresados as any}
                    categories={categories}
                    userApplicationJobIds={userApplicationJobIds}
                  />
                </div>

                {/* Notifications / Messages section */}
                {user.contactsTo && user.contactsTo.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-primary-100)] bg-gradient-to-br from-white to-[var(--color-primary-50)]">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">📩</span>
                      <h2 className="text-xl font-bold text-gray-800">Mensajes de Empresas</h2>
                    </div>
                    <div className="space-y-4">
                      {user.contactsTo.map((contact) => (
                        <div key={contact.id} className="p-4 bg-white rounded-xl border border-[var(--color-primary-200)] shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-[var(--color-primary-700)]">
                              {contact.fromUser.profile?.companyName || contact.fromUser.name || "Empresa"}
                            </h3>
                            <span className="text-[10px] text-gray-400 font-medium uppercase">
                              {new Date(contact.createdAt).toLocaleDateString("es-AR")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 italic border-l-4 border-[var(--color-primary-300)] pl-3 py-1">
                            "{contact.mensaje}"
                          </p>
                          <div className="mt-3 flex gap-2 items-center text-[10px] text-gray-500">
                            <span>📧 {contact.fromUser.email}</span>
                            {contact.fromUser.phone && <span>• 📱 {contact.fromUser.phone}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* My Applications section */}
                {user.applications.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Postulaciones</h2>
                    <div className="space-y-3">
                      {user.applications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div>
                            <p className="font-semibold text-gray-900">{app.job.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {app.job.category?.name && <span className="text-purple-600 font-medium">{app.job.category.name} • </span>}
                              Aplicado el {new Date(app.createdAt).toLocaleDateString("es-AR")}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            app.status === "RECIBIDA" ? "bg-blue-100 text-blue-700" :
                            app.status === "EN_REVISION" ? "bg-yellow-100 text-yellow-700" :
                            app.status === "INTERESADO" ? "bg-emerald-100 text-emerald-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {app.status.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
                  {user.profile?.category && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
                      <p className="text-sm bg-purple-50 text-purple-700 px-3 py-2 rounded-lg border border-purple-100 font-medium">
                        {user.profile.category.name}
                      </p>
                    </div>
                  )}
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
                        <a href={user.profile.cvUrl} target="_blank" className="underline">
                          Ver
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-xl border border-yellow-200">
                        Aún no subiste tu CV.
                      </div>
                    )}
                  </div>
                  <Link
                    href="/dashboard/perfil/editar"
                    className="block w-full text-center py-2 px-4 border border-[var(--color-celeste-200)] text-[var(--color-celeste-600)] font-semibold rounded-xl hover:bg-[var(--color-celeste-50)] transition-colors"
                  >
                    Editar Perfil
                  </Link>
                </div>
              )}

              {isRecruiter && (
                <div className="space-y-4">
                  {user.profile?.companyName && (
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Empresa</p>
                      <p className="text-sm font-bold text-gray-900">{user.profile.companyName}</p>
                      {user.profile.cuit && (
                        <p className="text-xs text-gray-500 mt-1">CUIT: {user.profile.cuit}</p>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">
                    Mantené la información de tu empresa actualizada para atraer a los mejores talentos.
                  </p>
                  <Link
                    href="/dashboard/perfil/editar"
                    className="block w-full text-center py-2 px-4 border border-[var(--color-primary-200)] text-[var(--color-primary-600)] font-semibold rounded-xl hover:bg-[var(--color-primary-50)] transition-colors"
                  >
                    Editar Empresa
                  </Link>
                </div>
              )}
            </div>

            {/* Verification Status for Postulantes */}
            {!isRecruiter && (
              <div className={`p-4 rounded-xl border ${
                user.verificadoCfp
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{user.verificadoCfp ? "✅" : "⏳"}</span>
                  <h3 className="text-sm font-bold text-gray-900">
                    {user.verificadoCfp ? "Perfil Verificado" : "Verificación Pendiente"}
                  </h3>
                </div>
                <p className="text-xs text-gray-600">
                  {user.verificadoCfp
                    ? "Tu perfil ha sido verificado como egresado del CFP. Las empresas verán tu badge de verificación."
                    : "Tu perfil está pendiente de verificación por el CFP. Una vez verificado, tu perfil tendrá mayor visibilidad."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
