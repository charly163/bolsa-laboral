import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    const { email } = await request.json()
    const generic = "Si el correo existe, recibirás instrucciones para restablecer tu contraseña."

    if (!email || typeof email !== "string") return NextResponse.json({ message: generic })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user) return NextResponse.json({ message: generic })

    const token = randomBytes(32).toString("hex")
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
    await prisma.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "https://bolsa-laboral.netlify.app"
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL,
                to: [user.email],
                subject: "Restablecer contraseña - CFP Bolsa Laboral",
                html: `<p>Solicitaste restablecer tu contraseña.</p><p><a href="${resetUrl}">Crear una nueva contraseña</a></p><p>El enlace vence en una hora.</p>`,
            }),
        })
    }

    return NextResponse.json({ message: generic })
}
