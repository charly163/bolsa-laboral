import { Suspense } from "react"
import ResetPasswordForm from "@/components/ResetPasswordForm"

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<main className="min-h-screen flex items-center justify-center text-gray-600">Cargando...</main>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
