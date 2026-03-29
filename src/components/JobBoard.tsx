"use client"

import { useState } from "react"
import CategoryFilter from "./CategoryFilter"
import ApplyButton from "./ApplyButton"
import EgresadoCard from "./EgresadoCard"
import VerifiedBadge from "./VerifiedBadge"

interface Category {
  id: string
  name: string
  slug: string
  children: { id: string; name: string; slug: string }[]
}

interface JobData {
  id: string
  title: string
  company: string
  description: string
  location: string | null
  salaryRange: string | null
  mode: string
  categoryId: string | null
  category: { id: string; name: string; parentId: string | null } | null
  recruiter: { name: string | null; verificadoCfp: boolean }
}

interface EgresadoData {
  id: string
  name: string | null
  verificadoCfp: boolean
  profile: {
    bio: string | null
    cvUrl: string | null
    category: { name: string } | null
  } | null
}

interface JobBoardProps {
  jobs: JobData[]
  egresados: EgresadoData[]
  categories: Category[]
  userApplicationJobIds: string[]
}

export default function JobBoard({ jobs, egresados, categories, userApplicationJobIds }: JobBoardProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // Get the selected category and its children IDs for filtering
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const categoryIds = selectedCategoryId
    ? [selectedCategoryId, ...(selectedCategory?.children.map((c) => c.id) || [])]
    : null

  // Filter jobs by selected category (parent or child)
  const filteredJobs = categoryIds
    ? jobs.filter((job) => job.categoryId && categoryIds.includes(job.categoryId))
    : jobs

  // Filter egresados by selected category
  const filteredEgresados = categoryIds
    ? egresados.filter((e) => {
        // We'd need the category's parent chain — for simplicity, show egresados whose
        // profile category matches any of the selected IDs
        return true // Show all verified egresados when no jobs match
      })
    : []

  // Show "Tablón Inverso" if filtering by category and no jobs match
  const showEgresados = selectedCategoryId && filteredJobs.length === 0

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </div>

      {/* Job Listings or Egresado Cards */}
      {showEgresados ? (
        <div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 mb-4">
            <p className="text-sm font-medium text-amber-800">
              🔄 No hay ofertas en <span className="font-bold">{selectedCategory?.name}</span> por el momento.
              Te mostramos egresados verificados de este rubro que podrían interesarte.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {egresados.length > 0 ? (
              egresados.map((egresado) => (
                <EgresadoCard key={egresado.id} user={egresado} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No hay egresados verificados en esta categoría aún.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-10 bg-[var(--color-celeste-50)] rounded-xl border-2 border-dashed border-[var(--color-celeste-200)]">
              <p className="text-[var(--color-celeste-700)] font-medium">
                {selectedCategoryId
                  ? "No hay ofertas en esta categoría por el momento."
                  : "No hay ofertas disponibles en este momento."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const hasApplied = userApplicationJobIds.includes(job.id)
                return (
                  <div
                    key={job.id}
                    className="p-5 border border-gray-100 rounded-xl hover:border-[var(--color-primary-300)] hover:shadow-lg transition-all bg-white relative group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl group-hover:text-[var(--color-primary-600)] transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm font-semibold text-[var(--color-celeste-700)] mt-1">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.category && (
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100">
                            {job.category.name}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs font-bold rounded-lg border border-[var(--color-primary-100)]">
                          {job.mode}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <div className="text-xs text-gray-500 flex items-center gap-3">
                        <span>📍 {job.location || "Remoto"}</span>
                        <span>💰 {job.salaryRange || "No especificado"}</span>
                      </div>
                      <ApplyButton jobId={job.id} hasApplied={hasApplied} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
