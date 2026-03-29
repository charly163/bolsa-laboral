export default function VerifiedBadge({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  }

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizes[size]} bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold rounded-full border border-emerald-200 shadow-sm`}
      title="Egresado verificado por el CFP"
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-1.065-3.745 3 3 0 00-5.304-1.065 3 3 0 00-3.745 1.065 3 3 0 00-1.065 3.745 3 3 0 001.065 3.745 3 3 0 005.304 1.065 3 3 0 003.745-1.065zm-3.11-4.945a.75.75 0 10-1.086-1.035l-3.08 3.23-1.254-1.317a.75.75 0 00-1.086 1.035l1.797 1.886a.75.75 0 001.086 0l3.623-3.8z"
          clipRule="evenodd"
        />
      </svg>
      Verificado CFP
    </span>
  )
}
