import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  {
    name: "Asesoramiento Contable y Legal",
    slug: "asesoramiento-contable-legal",
    children: ["Abogados y Estudios Jurídicos", "Contadores y Estudios", "Despachantes de Aduana", "Gestores", "Productores de Seguros", "Tasadores", "Otros"],
  },
  {
    name: "Belleza y Cuidado Personal",
    slug: "belleza-cuidado-personal",
    children: ["Cosmetología", "Cuidado Personal", "Depilación", "Estética", "Manicuría y Pedicuría", "Maquilladoras y Peinadoras", "Masajes y Tratamientos", "Peluquería", "Tatuajes y Piercings", "Otros"],
  },
  {
    name: "Comunicación y Diseño",
    slug: "comunicacion-diseno",
    children: ["Diseñadores Gráficos", "Locutores", "Marketing y Publicidad", "Traductores", "Otros"],
  },
  {
    name: "Cursos y Clases",
    slug: "cursos-clases",
    children: ["Apoyo Escolar y Universitario", "Artes Plásticas", "Canto y Baile", "Cocina", "Computación e Informática", "Deportes", "Fotografía", "Idiomas", "Instrumentos Musicales", "Manejo", "Maquillaje", "Mecánica", "Otros"],
  },
  {
    name: "Delivery",
    slug: "delivery",
    children: ["Reparto y Mensajería", "Otros"],
  },
  {
    name: "Fiestas y Eventos",
    slug: "fiestas-eventos",
    children: ["Alquiler de Carpas y Gazebos", "Alquiler de Equipos", "Alquiler de Escenarios", "Alquiler de Indumentaria", "Alquiler de Mobiliario", "Animación y Alquiler de Juegos", "Bebidas", "Catering", "Decoración y Ambientación", "Personal Gastronómico", "Salones y Quintas", "Servicios Audiovisuales", "Vehículos para Eventos", "Otros"],
  },
  {
    name: "Fotografía, Música y Cine",
    slug: "fotografia-musica-cine",
    children: ["Cine y Televisión", "Fotografía", "Música", "Otros"],
  },
  {
    name: "Hogar y Construcción",
    slug: "hogar-construccion",
    children: ["Instalación y Servicio Técnico", "Mantenimiento del Hogar", "Obras y Construcción", "Otros"],
  },
  {
    name: "Imprenta",
    slug: "imprenta",
    children: ["Folletos y Catálogos", "Impresiones Láser", "Impresiones en Gran Formato", "Otros"],
  },
  {
    name: "Mantenimiento de Vehículos",
    slug: "mantenimiento-vehiculos",
    children: ["Audio", "Cerrajería", "Cuidado del Vehículo", "Diagnósticos", "Llantas y Neumáticos", "Lubricentros", "Parabrisas y Cristales", "Seguridad Vehicular", "Service Programado", "Talleres", "Tuning", "Otros"],
  },
  {
    name: "Medicina y Salud",
    slug: "medicina-salud",
    children: ["Estudios Varios", "Prepagas", "Profesionales", "Servicios de Ambulancia", "Servicios de Ortopedia", "Otros"],
  },
  {
    name: "Otros Servicios",
    slug: "otros-servicios",
    children: ["Carga Virtual", "Esoterismo", "Inyección de Plástico", "Otros"],
  },
  {
    name: "Ropa y Moda",
    slug: "ropa-moda",
    children: ["Arreglos", "Bordados", "Confección", "Corte y Moldería", "Estampados", "Lavandería y Tintorería", "Otros"],
  },
  {
    name: "Servicios para Mascotas",
    slug: "servicios-mascotas",
    children: ["Adiestramiento Canino", "Cruza", "Cuidado e Higiene", "Paseadores de Perros", "Peluquerías Caninas", "Pensionados y Guarderías", "Perros en Adopción", "Traslados", "Veterinaria", "Otros"],
  },
  {
    name: "Servicios para Oficinas",
    slug: "servicios-oficinas",
    children: ["Dispensadoras y Expendedoras", "Equipos de Fitness", "Fotocopiadoras", "Montacargas y Ascensores", "Otros"],
  },
  {
    name: "Tecnología",
    slug: "tecnologia",
    children: ["Alarmas y Cámaras de Seguridad", "Audio y Video", "Celulares y Telefonía", "Computación", "Consolas", "Cámaras Digitales", "GPS", "Programadores", "Relojes", "Otros"],
  },
  {
    name: "Transporte",
    slug: "transporte",
    children: ["Alquiler de Autos", "Encomiendas y Mensajerías", "Mudanzas", "Pasajeros", "Remolques", "Otros"],
  },
  {
    name: "Viajes y Turismo",
    slug: "viajes-turismo",
    children: ["Alojamiento", "Alquiler de Autos", "Asistencia al Viajero", "Excursiones y Paseos", "Paquetes Turísticos", "Pasajes", "Otros"],
  },
]

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function main() {
  for (const item of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: item.slug },
      update: { name: item.name },
      create: { name: item.name, slug: item.slug },
    })

    for (const name of item.children) {
      const slug = `${item.slug}-${slugify(name)}`
      await prisma.category.upsert({
        where: { slug },
        update: { name, parentId: parent.id },
        create: { name, slug, parentId: parent.id },
      })
    }
  }

  console.log(`Seeded ${categories.length} service categories.`)
}

main()
  .catch((error) => {
    console.error("ADDITIONAL_CATEGORIES_SEED_ERROR:", error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
