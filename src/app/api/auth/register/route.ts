import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role, phone, dni, companyName, cuit, categoryId } = body

    if (!name || !email || !password) {
      return new NextResponse("Faltan campos requeridos", { status: 400 })
    }

    // Validate company fields for RECLUTADOR
    if (role === "RECLUTADOR" && (!companyName || !cuit)) {
      return new NextResponse("Los campos Nombre de Empresa y CUIT son obligatorios para reclutadores", { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new NextResponse("El correo ya está en uso", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userRole = role === "RECLUTADOR" ? "RECLUTADOR" : "POSTULANTE"

    const profileData: any = {}

    if (role === "RECLUTADOR") {
      profileData.companyName = companyName
      profileData.cuit = cuit
    }

    if (categoryId) {
      profileData.categoryId = categoryId
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        phone: phone || null,
        dni: dni || null,
        profile: {
          create: profileData,
        },
      },
    })

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("REGISTER_ERROR:", error)

    if (error?.code === "P1001" || error?.name === "PrismaClientInitializationError") {
      return new NextResponse("No se puede conectar con la base de datos. Verifica la conexión de Neon.", { status: 503 })
    }

    if (error?.code === "P2002") {
      return new NextResponse("El correo ya está en uso", { status: 400 })
    }

    console.error("REGISTER_ERROR_CODE:", error?.code || error?.name || "UNKNOWN")
    return new NextResponse("Error interno del servidor. Código: " + (error?.code || error?.name || "UNKNOWN"), { status: 500 })
  }
}
