import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

  console.log('\n🌱 Seeding demo accounts...')

  const password = await bcrypt.hash('Demo1234!', 10)
  const electricity = await prisma.category.findUniqueOrThrow({
    where: { slug: 'electricidad-domiciliaria' },
  })
  const plumbing = await prisma.category.findUniqueOrThrow({
    where: { slug: 'plomeria' },
  })

  await prisma.user.upsert({
    where: { email: 'admin@cfp-demo.com' },
    update: { password, role: 'ADMIN', name: 'Admin CFP Demo' },
    create: {
      name: 'Admin CFP Demo',
      email: 'admin@cfp-demo.com',
      password,
      role: 'ADMIN',
    },
  })

  const worker = await prisma.user.upsert({
    where: { email: 'electricista@cfp-demo.com' },
    update: { password, role: 'POSTULANTE', verificadoCfp: true, name: 'Juan Electricista' },
    create: {
      name: 'Juan Electricista',
      email: 'electricista@cfp-demo.com',
      password,
      role: 'POSTULANTE',
      verificadoCfp: true,
      phone: '11-5555-0101',
      profile: {
        create: {
          bio: 'Electricista domiciliario egresado del CFP, con experiencia en instalaciones y mantenimiento.',
          categoryId: electricity.id,
          yearsExperience: 5,
          matricula: 'MAT-DEMO-001',
        },
      },
    },
  })

  const company = await prisma.user.upsert({
    where: { email: 'empresa@cfp-demo.com' },
    update: { password, role: 'RECLUTADOR', name: 'Constructora Demo' },
    create: {
      name: 'Constructora Demo',
      email: 'empresa@cfp-demo.com',
      password,
      role: 'RECLUTADOR',
      profile: {
        create: {
          companyName: 'Constructora Demo SRL',
          cuit: '30-00000000-0',
          companyDescription: 'Empresa demo para probar publicación de ofertas.',
        },
      },
    },
  })

  await prisma.job.upsert({
    where: { id: 'demo-oferta-electricista' },
    update: {},
    create: {
      id: 'demo-oferta-electricista',
      title: 'Electricista domiciliario',
      description: 'Búsqueda de electricista para instalaciones y mantenimiento.',
      company: 'Constructora Demo SRL',
      location: 'CABA y alrededores',
      mode: 'PRESENCIAL',
      categoryId: electricity.id,
      recruiterId: company.id,
    },
  })

  await prisma.jobRequest.upsert({
    where: { id: 'demo-solicitud-plomero' },
    update: {},
    create: {
      id: 'demo-solicitud-plomero',
      title: 'Busco plomero',
      description: 'Necesito reparar una pérdida de agua en una vivienda.',
      location: 'CABA',
      categoryId: plumbing.id,
      userId: worker.id,
    },
  })

  console.log('  ✅ admin@cfp-demo.com')
  console.log('  ✅ electricista@cfp-demo.com')
  console.log('  ✅ empresa@cfp-demo.com')

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
