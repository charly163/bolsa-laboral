import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CategorySeed {
  name: string
  slug: string
  children: { name: string; slug: string }[]
}

const categories: CategorySeed[] = [
  {
    name: 'Electricidad',
    slug: 'electricidad',
    children: [
      { name: 'Electricidad Domiciliaria', slug: 'electricidad-domiciliaria' },
      { name: 'Electricidad Industrial', slug: 'electricidad-industrial' },
      { name: 'Instalaciones Eléctricas', slug: 'instalaciones-electricas' },
    ],
  },
  {
    name: 'Plomería y Gas',
    slug: 'plomeria-gas',
    children: [
      { name: 'Plomería', slug: 'plomeria' },
      { name: 'Gasista Matriculado', slug: 'gasista-matriculado' },
      { name: 'Instalaciones Sanitarias', slug: 'instalaciones-sanitarias' },
    ],
  },
  {
    name: 'Construcción',
    slug: 'construccion',
    children: [
      { name: 'Albañilería General', slug: 'albanileria-general' },
      { name: 'Hormigón Armado', slug: 'hormigon-armado' },
      { name: 'Mampostería', slug: 'mamposteria' },
    ],
  },
  {
    name: 'Pintura y Revestimientos',
    slug: 'pintura-revestimientos',
    children: [
      { name: 'Pintura Interior/Exterior', slug: 'pintura-interior-exterior' },
      { name: 'Durlock y Yeso', slug: 'durlock-yeso' },
      { name: 'Revestimientos', slug: 'revestimientos' },
    ],
  },
  {
    name: 'Carpintería',
    slug: 'carpinteria',
    children: [
      { name: 'Carpintería de Obra', slug: 'carpinteria-obra' },
      { name: 'Mueblería', slug: 'muebleria' },
      { name: 'Carpintería Metálica', slug: 'carpinteria-metalica' },
    ],
  },
  {
    name: 'Soldadura',
    slug: 'soldadura',
    children: [
      { name: 'Soldadura Eléctrica', slug: 'soldadura-electrica' },
      { name: 'Soldadura MIG/MAG', slug: 'soldadura-mig-mag' },
      { name: 'Soldadura TIG', slug: 'soldadura-tig' },
    ],
  },
  {
    name: 'Mecánica Automotor',
    slug: 'mecanica-automotor',
    children: [
      { name: 'Mecánica General', slug: 'mecanica-general' },
      { name: 'Electricidad del Automotor', slug: 'electricidad-automotor' },
      { name: 'Chapa y Pintura', slug: 'chapa-pintura' },
    ],
  },
  {
    name: 'Refrigeración y Climatización',
    slug: 'refrigeracion-climatizacion',
    children: [
      { name: 'Aire Acondicionado', slug: 'aire-acondicionado' },
      { name: 'Refrigeración Comercial', slug: 'refrigeracion-comercial' },
      { name: 'Calefacción', slug: 'calefaccion' },
    ],
  },
  {
    name: 'Electrónica',
    slug: 'electronica',
    children: [
      { name: 'Reparación de Equipos', slug: 'reparacion-equipos' },
      { name: 'Electrónica Industrial', slug: 'electronica-industrial' },
      { name: 'Automatización', slug: 'automatizacion' },
    ],
  },
  {
    name: 'Gastronomía',
    slug: 'gastronomia',
    children: [
      { name: 'Cocina', slug: 'cocina' },
      { name: 'Pastelería y Panadería', slug: 'pasteleria-panaderia' },
      { name: 'Manipulación de Alimentos', slug: 'manipulacion-alimentos' },
    ],
  },
  {
    name: 'Peluquería y Estética',
    slug: 'peluqueria-estetica',
    children: [
      { name: 'Peluquería', slug: 'peluqueria' },
      { name: 'Cosmetología', slug: 'cosmetologia' },
      { name: 'Manicuría', slug: 'manicuria' },
    ],
  },
  {
    name: 'Informática y Redes',
    slug: 'informatica-redes',
    children: [
      { name: 'Reparación de PC', slug: 'reparacion-pc' },
      { name: 'Redes y Cableado', slug: 'redes-cableado' },
      { name: 'Soporte Técnico', slug: 'soporte-tecnico' },
    ],
  },
  {
    name: 'Metalurgia y Mecanizado',
    slug: 'metalurgia-mecanizado',
    children: [
      { name: 'Tornería', slug: 'torneria' },
      { name: 'Fresado', slug: 'fresado' },
      { name: 'CNC', slug: 'cnc' },
    ],
  },
  {
    name: 'Textil y Confección',
    slug: 'textil-confeccion',
    children: [
      { name: 'Corte y Confección', slug: 'corte-confeccion' },
      { name: 'Diseño de Indumentaria', slug: 'diseno-indumentaria' },
      { name: 'Sastrería', slug: 'sastreria' },
    ],
  },
  {
    name: 'Mantenimiento',
    slug: 'mantenimiento',
    children: [
      { name: 'Mantenimiento Edilicio', slug: 'mantenimiento-edilicio' },
      { name: 'Mantenimiento Industrial', slug: 'mantenimiento-industrial' },
      { name: 'Limpieza Profesional', slug: 'limpieza-profesional' },
    ],
  },
]

async function main() {
  console.log('🌱 Seeding categories...')

  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    })

    for (const child of cat.children) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, parentId: parent.id },
        create: { name: child.name, slug: child.slug, parentId: parent.id },
      })
    }

    console.log(`  ✅ ${cat.name} (${cat.children.length} subcategorías)`)
  }

  console.log('\n🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
