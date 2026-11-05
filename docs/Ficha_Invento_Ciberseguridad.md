# FICHA DE INVENTO EN CIBERSEGURIDAD

**Diplomado de Gestión Técnica de Ciberseguridad · Pontificia Universidad Católica de Chile**

**Curso 5 — Técnicas y Herramientas de Ciberseguridad Avanzada, Parte II · Proyecto de innovación**

| Campo | Información |
|---|---|
| Nombre del equipo | Grupo 3 |
| Integrantes | nombres y apellidos de los 3–4 integrantes |
| Fecha | dd/mm/aaaa |

> **Cómo usar esta ficha:** completa cada sección en los recuadros. Responde con precisión, no con relleno. Si una sección necesita más espacio, agrega hojas. La última página trae un ejemplo completo de referencia para que veas el nivel de detalle esperado.

## 1. Título del invento

Un nombre breve y memorable. Puedes añadir un subtítulo de una línea que diga qué hace.

**Nombre — subtítulo en una frase:**

_Pendiente de completar._

## 2. Descripción general

En 4 a 6 líneas, explica qué es tu invento como si se lo contaras a alguien que no es técnico: qué es, para quién y qué hace.

Si recibes un correo electrónico y no sabes determinar si contiene enlaces maliciosos o adjuntos sospechosos, reenvialo a esta casilla : recepcionmail@dominio.cl y esta herramienta aoyada con inteligencia artificial lo analizara.

## 3. ¿Qué problema resuelve?

Describe el problema de ciberseguridad real que atacas. Guíate por estas preguntas:

- ¿Qué problema existe hoy y a quién afecta?
- ¿Qué consecuencias tiene (pérdidas, riesgo, tiempo, exposición)?
- ¿Cómo se resuelve actualmente y por qué eso es insuficiente?

**Contenido registrado:**

- Vector de ataque mas utilizado
- Exfiltracion de datos e informacion
- Lentitud en el análisis la cabecera de los correos electrónicos
- Lentitud en verificar los IoC que están insertos en el correo malicioso
- Documentacion para registro de los bloqueos pertinentes

## 4. ¿Qué procesos tiene?

Explica paso a paso cómo funciona, de principio a fin: qué entra, qué hace el sistema en cada etapa y qué entrega. Numera los pasos.

- Entrada (qué datos o eventos recibe)
- Procesamiento (detección, análisis, decisión…)
- Salida (alerta, bloqueo, informe, acción automática)

**Contenido registrado:**

- Mensaje de correo electrónico
- Procesa la cabecera del correo, analiza patrones, IOc, dominios, etc.
- Categoriza el nivel de riesgo, ¿??
- Informe para realizar las acciones inmediatas a nivel de red, tenant, cuentas de usuario, perimetro.

## 5. ¿Qué tecnología va a usar?

Lista las tecnologías concretas, agrupadas por capa. Sé específico (nombres y versiones cuando apliquen).

- Lenguajes y frameworks
- Seguridad y datos (SIEM/EDR, IA/ML, bases de datos, criptografía)
- Infraestructura (nube, contenedores, APIs, servicios externos)

**Tecnologías anotadas:**

- Next’s
- Mongodb
- Vercel
- Nextjs

## 6. ¿Qué arquitectura va a usar?

Muestra cómo se conectan las piezas: componentes, flujo de datos y dónde vive cada parte (cliente, servidor, nube). Puedes describirla o pegar un diagrama dentro del recuadro.

_Describe o pega aquí tu diagrama de arquitectura._

## 7. Principales ventajas de innovación

Explica qué hace a tu invento nuevo o mejor que lo que ya existe. Entre 3 y 5 ventajas concretas.

- ¿Qué hace distinto o por primera vez?
- ¿Qué mejora medible aporta (tiempo, costo, cobertura, precisión)?
- ¿Por qué es difícil de copiar o qué barrera de entrada crea?

_Pendiente de completar._

## ✓ Autoevaluación de innovación

Antes de entregar, marca honestamente dónde está tu proyecto en cada criterio.

| Criterio | Pregunta guía | Alto | Medio | Bajo |
|---|---|:---:|:---:|:---:|
| Novedad | ¿Aporta algo que hoy no existe o mejora claramente lo existente? | ☐ | ☐ | ☐ |
| Impacto | ¿Resuelve un problema que le importa a alguien real? | ☐ | ☐ | ☐ |
| Factibilidad técnica | ¿Se puede construir con las tecnologías que proponen? | ☐ | ☐ | ☐ |
| Viabilidad | ¿Es realista en tiempo, costo y conocimiento del equipo? | ☐ | ☐ | ☐ |
| Escalabilidad | ¿Sirve para más casos o más usuarios sin rehacerlo? | ☐ | ☐ | ☐ |

---

# EJEMPLO DE REFERENCIA

Un ejemplo ficticio y breve, solo para mostrar el nivel de detalle. Tu invento no tiene que parecerse a este.

### 1 · Título

CentinelaPyme — detección de phishing dirigido para correos de pequeñas empresas.

### 2 · Descripción

Un complemento de correo que analiza en segundos cada mensaje entrante y avisa al usuario, en lenguaje simple, si parece un intento de phishing o fraude, pensado para pymes que no tienen equipo de seguridad.

### 3 · Problema que resuelve

El phishing es la puerta de entrada de la mayoría de los incidentes en pymes, que no tienen SOC ni filtros avanzados. Hoy dependen del criterio del empleado; un solo clic puede costar el negocio.

### 4 · Procesos

1. Recibe el correo vía API del proveedor.
2. Extrae remitente, enlaces, adjuntos y encabezados.
3. Un modelo evalúa señales (dominios parecidos, urgencia, reputación).
4. Muestra un semáforo y, si es grave, mueve el correo a cuarentena.

### 5 · Tecnologías

Python y FastAPI; modelo de clasificación (scikit-learn) más reglas; APIs de Microsoft 365 / Google Workspace; urlscan y VirusTotal para enriquecer; PostgreSQL; contenedores Docker.

### 6 · Arquitectura

Complemento en el cliente de correo → backend en la nube (API) → motor de análisis (modelo + reglas) → servicios externos de reputación → base de datos de veredictos → panel web para el administrador.

### 7 · Ventajas de innovación

Explica por qué marca un correo, en lenguaje para no técnicos (no solo lo bloquea). Aprende de lo que cada pyme reporta. Se instala sin cambiar de proveedor de correo. Costo por usuario mucho menor que una suite corporativa.
