"use client"

import { useState } from "react"
import { applyToJob } from "@/app/actions/application"
import { useRouter } from "next/navigation"

export default function ApplyButton({ jobId, hasApplied }: { jobId: string, hasApplied: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(hasApplied)
  const router = useRouter()

  const handleApply = async () => {
    if (success) return
    
    setLoading(true)
    setError("")

    const result = await applyToJob(jobId)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.success) {
      setSuccess(true)
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button 
        onClick={handleApply}
        disabled={loading || success}
        className={`px-4 py-2 text-white text-sm font-bold rounded-lg transition-all ${
          success 
            ? "bg-green-500 cursor-default" 
            : "bg-[var(--color-celeste-500)] hover:bg-[var(--color-celeste-600)]"
        } ${loading ? "opacity-70 cursor-wait" : ""}`}
      >
        {loading ? "Procesando..." : success ? "✓ Postulado" : "Postularme"}
      </button>
      {error && <span className="text-red-500 text-xs font-medium">{error}</span>}
    </div>
  )
}
