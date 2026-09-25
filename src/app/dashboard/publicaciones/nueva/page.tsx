import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createPublication } from "@/app/actions/publication"
import Link from "next/link"

const publicationTypeHelp = {
    OFERTA_LABORAL: "Busco una persona para contratar o incorporar a un trabajo.",
    SERVICIO_PROFESIONAL: "Ofrezco mis conocimientos o servicios, como electricidad o plomeria.",
    PRODUCTO: "Vendo o promociono algo que fabrico, como pastas caseras.",
    SOLICITUD_TRABAJO: "Necesito que alguien realice un trabajo especifico.",
} as const

const publicationTypes = [
    { value: "OFERTA_LABORAL", label: "Oferta laboral", description: publicationTypeHelp.OFERTA_LABORAL },
    { value: "SERVICIO_PROFESIONAL", label: "Servicio profesional", description: publicationTypeHelp.SERVICIO_PROFESIONAL },
    { value: "PRODUCTO", label: "Producto o emprendimiento", description: publicationTypeHelp.PRODUCTO },
    { value: "SOLICITUD_TRABAJO", label: "Solicitud de trabajo", description: publicationTypeHelp.SOLICITUD_TRABAJO },
] as const

export default async function NewPublicationPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: { children: { orderBy: { name: "asc" } } },
        orderBy: { name: "asc" },
    })

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Nueva publicación</p>
                        <h1 className="mt-1 text-3xl font-black text-gray-900">Contale a la comunidad qué necesitás o qué ofrecés</h1>
                    </div>
                    <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-teal-700">Volver</Link>
                </div>

                <form action={createPublication} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                    <fieldset>
                        <legend className="text-sm font-bold text-gray-900">¿Qué querés publicar?</legend>
                        <p className="mt-1 text-sm text-gray-500">El tipo define cómo se mostrará tu publicación y qué acciones podrán realizar otros usuarios.</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {publicationTypes.map((item) => (
                                <label key={item.value} className="cursor-pointer rounded-xl border border-gray-200 p-4 transition hover:border-teal-500 has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50">
                                    <input type="radio" name="type" value={item.value} required className="sr-only" />
                                    <span className="font-bold text-gray-900">{item.label}</span>
                                    <span className="mt-1 block text-sm leading-5 text-gray-600">{item.description}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-900">Título</label>
                        <input id="title" name="title" required className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" placeholder="Ej: Pastas caseras para retirar" />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-900">Descripción</label>
                        <textarea id="description" name="description" required rows={5} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" placeholder="Explicá qué ofrecés o qué trabajo necesitás." />
                    </div>

                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-bold text-gray-900">Rubro o categoría</label>
                        <select id="categoryId" name="categoryId" required className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3">
                            <option value="">Seleccioná un rubro</option>
                            {categories.map((category) => (
                                <optgroup key={category.id} label={category.name}>
                                    <option value={category.id}>{category.name} (general)</option>
                                    {category.children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div><label htmlFor="price" className="block text-sm font-bold text-gray-900">Precio o presupuesto</label><input id="price" name="price" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" placeholder="Opcional" /></div>
                        <div><label htmlFor="location" className="block text-sm font-bold text-gray-900">Zona</label><input id="location" name="location" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" placeholder="Ej: CABA" /></div>
                    </div>

                    <div><label htmlFor="imageUrl" className="block text-sm font-bold text-gray-900">Imagen</label><input id="imageUrl" name="imageUrl" type="url" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" placeholder="Pegá la URL de una imagen (opcional)" /></div>

                    <button type="submit" className="w-full rounded-xl bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800">Publicar</button>
                </form>
            </div>
        </main>
    )
}
