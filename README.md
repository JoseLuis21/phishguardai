# PhishGuardAI — app web

PhishGuardAI analiza con IA los correos sospechosos que los empleados reenvían a una casilla de análisis. Un **analizador en Python** (servicio aparte, no incluido en este repositorio) lee la casilla, clasifica cada correo (`PHISHING`, `SOSPECHOSO`, `PROBABLEMENTE LEGÍTIMO`, `NO CONCLUYENTE`), le asigna un riesgo de 0 a 100 y guarda el resultado en MySQL.

Esta app **Next.js** lee esos datos y los presenta:

- **Landing pública** (`/`): explica el producto y cómo reenviar un correo.
- **Panel** (`/panel`): el talonario de análisis. El **analista** ve todos los análisis, su evidencia y la técnica MITRE ATT&CK, y registra acciones (dominio bloqueado, búsqueda en el tenant, informe reenviado, anulado). El **empleado** ve solo los informes de los correos que él reportó.
- **Métricas** (`/panel/metricas`, solo analistas): totales, evolución en el tiempo, desglose por categoría y por estado de atención, con filtros de último día, 7 días, 30 días y 12 meses.
- **Cuentas** (`/login`, `/registro`, `/activar`): registro con enlace de activación por correo.

Proyecto de innovación del Grupo 3, Diplomado de Gestión Técnica de Ciberseguridad, Pontificia Universidad Católica de Chile.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Base UI) · Auth.js v5 · MySQL (`mysql2`) · Zod · Nodemailer. Se despliega en Vercel.

## Requisitos

- **Node.js 22.18 o superior.** Los scripts de `scripts/` son TypeScript y corren directamente con Node.
- **pnpm 9** (`corepack enable` lo deja disponible con la versión de `packageManager`).
- **MySQL 8** con las tablas del analizador (ver [Base de datos](#base-de-datos)).
- Una cuenta **SMTP** para enviar los correos de activación.

## Variables de entorno

Copia la plantilla y complétala:

```bash
cp .env.example .env.local
```

| Variable | Obligatoria | Para qué sirve |
| --- | --- | --- |
| `MYSQL_HOST` | Sí | Host de la base MySQL. |
| `MYSQL_PORT` | No | Puerto de MySQL. Por defecto `3306`. |
| `MYSQL_DATABASE` | Sí | Nombre de la base, la misma donde escribe el analizador. |
| `MYSQL_USER` | Sí | Usuario de MySQL de la app web. |
| `MYSQL_PASSWORD` | Sí | Contraseña de ese usuario. |
| `AUTH_SECRET` | Sí | Firma las sesiones de Auth.js. Genera uno con `openssl rand -base64 32`. |
| `SMTP_HOST` | Sí* | Servidor SMTP. |
| `SMTP_PORT` | No | Por defecto `465` (TLS directo). Con otro puerto, por ejemplo `587`, se exige STARTTLS. |
| `SMTP_USER` | Sí* | Usuario SMTP. |
| `SMTP_PASSWORD` | Sí* | Contraseña SMTP. |
| `SMTP_FROM` | No | Remitente. Por defecto `"PhishGuardAI" <SMTP_USER>`. |
| `APP_URL` | No | URL pública de los enlaces enviados por correo. Si falta, se usa `http://localhost:3000` en desarrollo y el dominio de producción del proyecto en Vercel (`VERCEL_PROJECT_PRODUCTION_URL`). En cualquier otro hosting es obligatoria. |

\* Solo se usan al registrarse en `/registro`. Si no las configuras, el panel funciona igual, pero el registro falla al enviar el correo. En ese caso crea los usuarios con `pnpm usuarios:crear`.

La app valida estas variables con Zod al conectarse y responde con un error genérico si falta alguna. Nunca imprime los valores.

## Base de datos

La app comparte la base con el analizador:

| Tabla | Quién la crea | Columnas que lee la app |
| --- | --- | --- |
| `correos_analizados` | Analizador | `id`, `asunto`, `solicitante_email`, `clasificacion`, `riesgo`, `resumen`, `recomendacion`, `estado_envio`, `fecha_analisis`, `fecha_envio`, `attack_tecnica`, `attack_evidencia` |
| `indicadores_phishing` | Analizador | `id`, `correo_id`, `descripcion` |
| `eventos_sistema` | Analizador | `id`, `correo_id`, `tipo`, `detalle`, `fecha` |
| `usuarios` | App web | Migración `001` |
| `acciones_analista` | App web | Migración `001` |
| `tokens_activacion` | App web | Migración `002` |

La app no modifica las tablas del analizador. Las suyas se crean con las migraciones de `db/migrations`, en orden y **después** de que exista `correos_analizados`, porque `acciones_analista` tiene una llave foránea hacia ella:

```bash
mysql -h <host> -u <usuario> -p <base> < db/migrations/001_usuarios_y_acciones.sql
mysql -h <host> -u <usuario> -p <base> < db/migrations/002_tokens_activacion.sql
```

Las migraciones usan `CREATE TABLE IF NOT EXISTS`, así que se pueden volver a ejecutar sin riesgo.

Las fechas se guardan como `DATETIME` en la zona horaria de la sesión de MySQL. La app las convierte con `UNIX_TIMESTAMP()` y las muestra en hora de Chile (`America/Santiago`).

## Levantar en local

```bash
pnpm install
cp .env.example .env.local   # y completa los valores
# aplica las migraciones (sección anterior)
pnpm usuarios:crear          # crea tu primer usuario ANALISTA
pnpm dev
```

Abre <http://localhost:3000> e inicia sesión en `/login`.

### Usuarios

- `pnpm usuarios:crear`: pide email, nombre, rol (`ANALISTA` o `EMPLEADO`) y contraseña en la terminal. La contraseña no se muestra al escribirla y solo se guarda su hash bcrypt. Si el email ya existe, actualiza ese usuario.
- `pnpm usuarios:activar persona@dominio.cl`: activa a mano una cuenta creada desde `/registro`.

Desde `/registro` solo se crean cuentas de **empleado**, que quedan inactivas hasta abrir el enlace de activación. El rol de analista solo se asigna con `pnpm usuarios:crear`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo en `http://localhost:3000`. |
| `pnpm build` | Build de producción. |
| `pnpm start` | Sirve el build de producción. |
| `pnpm lint` | ESLint. |
| `pnpm typecheck` | Revisión de tipos con `tsc --noEmit`. |
| `pnpm usuarios:crear` | Crea o actualiza un usuario. |
| `pnpm usuarios:activar <email>` | Activa una cuenta registrada. |

## Despliegue en Vercel

1. Vincula el proyecto con `vercel link`.
2. Carga las variables de la tabla anterior en *Settings → Environment Variables* o con `vercel env add`. `APP_URL` es opcional: si falta, se usa el dominio de producción del proyecto.
3. La base MySQL debe aceptar conexiones desde Vercel.
4. Despliega con `vercel deploy --prod`, o conecta este repositorio en *Settings → Git* para que cada push a `main` se despliegue solo.

## Estructura

```text
app/
  (inicio)/          landing pública
  login/ registro/ activar/   cuentas
  panel/             talonario de análisis y acciones del analista
    metricas/        dashboard de métricas (solo analistas)
  _internal/         capa de acceso a datos (solo servidor): MySQL, sesión, correo
  _interfaces/       tipos y DTO que el servidor entrega al cliente
  _components/ _utils/        UI y utilidades compartidas
auth.ts, auth.config.ts       Auth.js con credenciales y sesiones JWT
proxy.ts             redirige a /login a quien no tiene sesión
db/migrations/       tablas propias de la app web
scripts/             gestión de usuarios por terminal
docs/                ficha del proyecto y modelo de datos
```

Cada módulo sigue la misma convención. `_internal/` lleva `import "server-only"` y vuelve a verificar la sesión y el rol en cada consulta. `_schemas/` valida con Zod los parámetros de URL, las entradas de las acciones y las filas de MySQL. `_actions/` contiene las Server Actions, que solo delegan en `_internal/`.
