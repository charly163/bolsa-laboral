"use client"

import { useState } from "react"
import { verificarAlumno, desverificarAlumno, deleteCategory, createCategory } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

export function VerifyButton({ userId, isVerified }: { userId: string; isVerified: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    const action = isVerified ? desverificarAlumno : verificarAlumno
    const result = await action(userId)
    if (result.success) {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-50 ${
        isVerified
          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
      }`}
    >
      {loading ? "..." : isVerified ? "Quitar verificación" : "✓ Verificar"}
    </button>
  )
}

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    if (!confirm("¿Estás seguro? Se eliminarán también las subcategorías.")) return
    setLoading(true)
    const result = await deleteCategory(categoryId)
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
    >
      {loading ? "..." : "Eliminar"}
    </button>
  )
}

export function AddCategoryForm({ parentCategories }: { parentCategories: { id: string; name: string }[] }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const formData = new FormData(e.currentTarget)
    const result = await createCategory(formData)

    if (result.error) {
      setMessage(result.error)
    } else {
      setMessage("✅ Categoría creada")
      e.currentTarget.reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
        <input
          name="name"
          required
          placeholder="Ej: Herrería"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)]"
        />
      </div>
      <div className="w-full sm:w-48">
        <label className="block text-xs font-medium text-gray-600 mb-1">Categoría padre (opcional)</label>
        <select
          name="parentId"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)]"
        >
          <option value="">— Ninguna (es rubro principal) —</option>
          {parentCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-celeste-500)] rounded-lg hover:shadow-md transition-all disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? "Creando..." : "+ Agregar"}
      </button>
      {message && <span className="text-xs font-medium text-gray-600">{message}</span>}
    </form>
  )
}
