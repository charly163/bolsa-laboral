import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDashboardStats, getAlumnos, getEmpresas } from "@/app/actions/admin"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { VerifyButton, DeleteCategoryButton, AddCategoryForm } from "@/components/AdminActions"
import VerifiedBadge from "@/components/VerifiedBadge"

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const [stats, alumnos, empresas, categories] = await Promise.all([
    getDashboardStats(),
    getAlumnos("todos"),
    getEmpresas(),
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: { orderBy: { name: "asc" } },
      },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-[var(--color-primary-600)]">
                ← Panel
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-[var(--color-primary-600)] text-transparent bg-clip-text">
                Administración
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Postulantes" value={stats.totalPostulantes} icon="👤" color="blue" />
            <StatCard label="Empresas" value={stats.totalEmpresas} icon="🏢" color="purple" />
            <StatCard label="Verificados" value={stats.verificados} icon="✅" color="green" />
            <StatCard label="Pendientes" value={stats.pendientes} icon="⏳" color="amber" />
            <StatCard label="Ofertas Activas" value={stats.ofertasActivas} icon="💼" color="cyan" />
            <StatCard label="Total Ofertas" value={stats.totalOfertas} icon="📋" color="gray" />
            <StatCard label="Contactos" value={stats.totalContactos} icon="🤝" color="emerald" />
            <StatCard label="Postulaciones" value={stats.totalPostulaciones} icon="📨" color="indigo" />
          </div>
        )}

        {/* Alumnos Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Alumnos / Egresados</h2>
            <p className="text-sm text-gray-500 mt-1">Gestiona la verificación de los egresados del CFP.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-600">Nombre</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">DNI / CUIL</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Rubro</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Estado</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alumnos.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{alumno.name}</span>
                        {alumno.verificadoCfp && <VerifiedBadge />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{alumno.email}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {alumno.dni || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {alumno.profile?.category?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        alumno.verificadoCfp
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {alumno.verificadoCfp ? "Verificado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <VerifyButton userId={alumno.id} isVerified={alumno.verificadoCfp} />
                    </td>
                  </tr>
                ))}
                {alumnos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No hay alumnos registrados aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Empresas Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Empresas Registradas</h2>
            <p className="text-sm text-gray-500 mt-1">Listado de empresas que buscan talento.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-600">Empresa</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Contacto</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">CUIT</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Ofertas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {empresas.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{emp.profile?.companyName || emp.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{emp.email}</p>
                      {emp.phone && <p className="text-xs text-gray-400">{emp.phone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-700">{emp.profile?.cuit || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{emp.jobsPosted.length}</span>
                    </td>
                  </tr>
                ))}
                {empresas.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No hay empresas registradas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Categories Management */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Gestión de Categorías</h2>
            <p className="text-sm text-gray-500 mt-1">Agrega, edita o elimina rubros y subcategorías.</p>
          </div>
          <div className="p-6">
            {/* Add Category Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <AddCategoryForm parentCategories={categories.map((c) => ({ id: c.id, name: c.name }))} />
            </div>

            {/* Category List */}
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{cat.name}</span>
                      <span className="text-xs text-gray-500">({cat.children.length} subcategorías)</span>
                    </div>
                    <DeleteCategoryButton categoryId={cat.id} />
                  </div>
                  {cat.children.length > 0 && (
                    <div className="p-3 space-y-1">
                      {cat.children.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                          <span className="text-sm text-gray-700">↳ {sub.name}</span>
                          <DeleteCategoryButton categoryId={sub.id} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

// Stats card component
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    green: "bg-green-50 border-green-200",
    amber: "bg-amber-50 border-amber-200",
    cyan: "bg-cyan-50 border-cyan-200",
    gray: "bg-gray-50 border-gray-200",
    emerald: "bg-emerald-50 border-emerald-200",
    indigo: "bg-indigo-50 border-indigo-200",
  }

  return (
    <div className={`p-4 rounded-xl border ${colorMap[color] || colorMap.gray}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
