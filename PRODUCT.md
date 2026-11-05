# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Analista de seguridad / TI (principal del panel web):** revisa el dashboard para ver qué correos se analizaron, cuáles son phishing o amenazas críticas, qué indicadores (IoC) aparecen y qué acciones tomar en red, tenant, cuentas de usuario y perímetro. Necesita rapidez para pasar de una alerta al detalle y a la acción, y dejar registro de los bloqueos.
- **Empleado que reporta:** recibe un correo dudoso, lo reenvía a la casilla de análisis y recibe el informe por email. También puede ver en la web el detalle del informe de su propio correo. No es técnico; necesita un veredicto claro y qué hacer.

## Product Purpose

PhishGuardAI analiza con IA los correos sospechosos que los usuarios reenvían a la casilla `analisis.phishing@coplex.cl`. Procesa la cabecera, los enlaces, los adjuntos, los dominios y los patrones del mensaje, lo clasifica, le asigna un nivel de riesgo y entrega un informe con recomendaciones.

Problema que ataca: el correo es el vector de ataque más usado y una vía de exfiltración de datos. Analizar cabeceras y verificar IoC a mano es lento, y documentar los bloqueos que se hacen cuesta trabajo.

Éxito: el empleado sabe en poco tiempo si un correo es peligroso, y el analista actúa rápido con evidencia y deja un registro documentado.

## Positioning

El reporte parte de un gesto que cualquier empleado ya sabe hacer: reenviar un correo. No hay que instalar nada en el cliente de correo. El mismo análisis le da un veredicto en lenguaje simple a quien reporta y evidencia con acciones concretas (red, tenant, cuentas, perímetro) al equipo de seguridad.

## Operating Context

1. El empleado reenvía el correo sospechoso a `analisis.phishing@coplex.cl`.
2. Un analizador en Python, separado de la app web y ya operativo, lee la casilla, procesa el mensaje: cabecera, IoC, dominios y patrones.
3. Clasifica el correo como `PHISHING`, `SOSPECHOSO`, `PROBABLEMENTE LEGÍTIMO` o `NO CONCLUYENTE`, con un riesgo de 0 a 100, un resumen generado por la IA y recomendaciones.
4. Envía el informe al solicitante por email y registra eventos en una bitácora.
5. La app web Next.js lee esos datos y los presenta al analista y al empleado.

Proyecto de innovación del Grupo 3 en el Diplomado de Gestión Técnica de Ciberseguridad de la Pontificia Universidad Católica de Chile (Curso 5). Se planea un piloto con una organización real.

## Capabilities and Constraints

**Superficies de la app web:**
- Dashboard de métricas: total de correos analizados, phishing detectados, amenazas críticas, usuarios que reportan y evolución de las detecciones en el tiempo.
- Detalle de cada análisis: clasificación, riesgo, resumen de la IA, indicadores, recomendaciones y estado de envío del informe.
- Bitácora de eventos del sistema.
- Landing pública que explica el producto y cómo reenviar un correo a la casilla.

**Modelo de datos (MySQL):**
- `correos_analizados`: `id`, `fecha_analisis`, `solicitante_email`, `clasificacion`, `riesgo` (0–100), `resumen`, `recomendacion`, `estado_envio`.
- `indicadores_phishing`: varios por correo (p. ej. "Enlace externo sospechoso", "Posible suplantación de identidad", "Solicitud urgente de información", "Dominio coherente con el remitente"). Incluye tanto señales de riesgo como señales de legitimidad.
- `eventos_sistema`: `ANALISIS_FINALIZADO`, `PHISHING_DETECTADO`, `AMENAZA_CRITICA`, `INFORME_ENVIADO`.

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, pnpm. Base de datos MySQL (no MongoDB). Despliegue en Vercel. El analizador es un servicio Python aparte.

**Terminología:** el producto habla en español. Las etiquetas de clasificación y los nombres de eventos son los del modelo de datos.

**Sin definir:**
- Los umbrales que separan una "amenaza crítica" del resto de los niveles de riesgo.
- La autenticación y los roles: cómo se separa lo que ve el analista de lo que ve el empleado, que solo ve sus propios informes.
- El proveedor de IA.

## Brand Commitments

- Nombre: **PhishGuardAI**.
- Interfaz en español (Chile).
- No hay logo ni identidad visual definidos.

## Evidence on Hand

- `docs/Ficha_Invento_Ciberseguridad.md`: ficha del invento, todavía parcial.
- `docs/tablas.pdf`: modelo de datos y uso de cada tabla en el dashboard.
- Todavía no hay datos reales, clientes, testimonios, métricas de precisión ni benchmarks. El piloto usará datos reales: **no inventar** cifras de detección, organizaciones ni testimonios en ninguna superficie.

## Product Principles

1. **Veredicto primero, evidencia después.** Cada análisis dice qué es y qué hacer antes de mostrar el detalle técnico.
2. **Dos lectores, una verdad.** El empleado recibe lenguaje simple y el analista recibe IoC y acciones. Ambos ven el mismo análisis, no versiones distintas.
3. **Honestidad sobre la incertidumbre.** `NO CONCLUYENTE` y `SOSPECHOSO` son resultados legítimos, no fallas que haya que ocultar. Las señales de legitimidad se muestran junto a las de riesgo.
4. **Todo deja rastro.** Cada análisis, envío y acción queda registrado y se puede consultar. La documentación de bloqueos es parte del producto.
5. **Datos reales, privacidad real.** Se manejan correos de personas reales. Cada usuario ve solo lo que le corresponde.
