# Bolsa laboral CFP

Bolsa laboral para conectar egresados y trabajadores calificados del CFP con empresas, empleadores y personas que buscan oficios especializados.

## Stack

- Next.js 16
- Prisma ORM
- PostgreSQL / Neon
- Netlify
- Tailwind CSS

## Requisitos

- Node.js 20+
- Cuenta en Neon o PostgreSQL
- Cuenta en Netlify

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require"
NEXTAUTH_SECRET="cambia-esto-por-una-clave-segura"
NEXTAUTH_URL="http://localhost:3000"
```

### Neon example

```env
DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Desarrollo local

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev -- --port 3001
```

Open http://localhost:3001

## Producción en Netlify

1. Conectar el repo en Netlify.
2. Configurar el build command:
   ```bash
   npm run build
   ```
3. Definir variables de entorno con `DATABASE_URL`, `NEXTAUTH_SECRET` y `NEXTAUTH_URL`.
4. Deploy del proyecto.

## Funcionalidades principales del MVP

- Registro de personas y empresas
- Perfiles con especialización y verificación
- Publicación de ofertas laborales y búsquedas de trabajo
- Verificación por parte del CFP
- Calificaciones y reputación
- Búsquedas por oficio, ubicación y modalidad
- Chat interno entre usuarios
- Panel administrativo del CFP

## Roadmap

- Módulo de verificación de egresados
- Calificación de perfiles
- Chat interno por conversación
- Flujos de postulación y match
- Notificaciones de mensajes y postulaciones
