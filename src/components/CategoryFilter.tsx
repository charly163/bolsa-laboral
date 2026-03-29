"use client"

interface CategoryFilterProps {
  categories: {
    id: string
    name: string
    slug: string
    children: { id: string; name: string; slug: string }[]
  }[]
  selectedCategoryId: string | null
  onSelect: (categoryId: string | null) => void
}

export default function CategoryFilter({ categories, selectedCategoryId, onSelect }: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Filtrar por Rubro</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
            selectedCategoryId === null
              ? "bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-celeste-500)] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(selectedCategoryId === cat.id ? null : cat.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
              selectedCategoryId === cat.id
                ? "bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-celeste-500)] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
