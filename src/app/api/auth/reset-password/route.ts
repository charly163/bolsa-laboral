import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    const { token, password } = await request.json()
    if (!token || typeof token !== "string" || typeof password !== "string" || password.length < 6) {
        return new NextResponse("El token es inválido o la contraseña debe tener al menos 6 caracteres.", { status: 400 })
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })
    if (!resetToken || resetToken.expiresAt < new Date()) {
        return new NextResponse("El enlace es inválido o ya venció.", { status: 400 })
    }

    await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: await bcrypt.hash(password, 10) },
    })
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })

    return NextResponse.json({ message: "Contraseña actualizada correctamente." })
}
