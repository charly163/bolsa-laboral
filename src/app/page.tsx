import Link from "next/link"

const trades = [
  { name: "Electricidad", detail: "Instalaciones y mantenimiento", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Plomería y gas", detail: "Reparaciones y obras", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { name: "Construcción", detail: "Albañilería y terminaciones", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "Carpintería", detail: "Muebles y obra", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7faf9] text-slate-900">
      <nav className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-xl font-black tracking-tight text-teal-700">CFP Bolsa Laboral</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:block">Ingresar</Link>
            <Link href="/register" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">Registrarme</Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_right,_#d9f7ef,_transparent_38%),linear-gradient(135deg,_#effbf8,_#f8fbff)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Talento local. Oficios reales.</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">Encontrá a la persona indicada para hacer el trabajo.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Una bolsa laboral vinculada al CFP para conectar empresas, vecinos y profesionales de oficios verificados.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="rounded-lg bg-teal-700 px-6 py-3.5 text-center font-bold text-white shadow-lg shadow-teal-700/20 hover:bg-teal-800">Publicar una necesidad</Link>
              <Link href="/register" className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-center font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700">Ofrecer mis servicios</Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">Para publicar, postularte o contactar a alguien necesitás una cuenta.</p>
          </div>

          <div className="rounded-2xl border border-white bg-white p-6 shadow-xl shadow-slate-900/10">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div><p className="text-sm font-bold text-slate-900">¿Qué servicio necesitás?</p><p className="text-xs text-slate-500">Buscá por oficio o especialidad</p></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">CFP verificado</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-slate-400"><span>⌕</span><span className="text-sm">Ej. electricista matriculado</span></div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4"><div><p className="font-bold text-slate-800">Juan Electricista</p><p className="text-xs text-slate-500">Instalaciones domiciliarias · CABA</p></div><span className="text-xs font-bold text-emerald-700">Verificado</span></div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4"><div><p className="font-bold text-slate-800">María Plomería</p><p className="text-xs text-slate-500">Reparaciones · Zona Norte</p></div><span className="text-xs font-bold text-amber-600">4.9 ★</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Especialidades</p><h2 className="mt-2 text-3xl font-black tracking-tight">Encontrá el oficio que necesitás</h2></div><Link href="/register" className="text-sm font-bold text-teal-700 hover:underline">Ver todas las categorías →</Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trades.map((trade) => <Link key={trade.name} href="/register" className={`rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-md ${trade.color}`}><p className="font-black">{trade.name}</p><p className="mt-2 text-sm opacity-80">{trade.detail}</p></Link>)}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-3 lg:px-8"><div><p className="text-3xl font-black text-teal-700">01</p><h3 className="mt-3 font-black">Publicá lo que buscás</h3><p className="mt-2 text-sm leading-6 text-slate-600">Contá qué trabajo necesitás y en qué zona.</p></div><div><p className="text-3xl font-black text-teal-700">02</p><h3 className="mt-3 font-black">Conocé perfiles reales</h3><p className="mt-2 text-sm leading-6 text-slate-600">Compará experiencia, calificaciones y verificación CFP.</p></div><div><p className="text-3xl font-black text-teal-700">03</p><h3 className="mt-3 font-black">Hablá y acordá</h3><p className="mt-2 text-sm leading-6 text-slate-600">Contactá por chat y coordiná el trabajo directamente.</p></div></div>
      </section>
      <footer className="border-t border-slate-200 bg-slate-950 px-5 py-8 text-center text-sm text-slate-400">Una iniciativa para conectar egresados del CFP con nuevas oportunidades.</footer>
    </main>
  )
}
