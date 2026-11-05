import type { AnalisisDetalleDTO } from "@/app/_interfaces/analisis";
import { tecnicaAttack } from "@/app/_utils/attack";
import { CORREO_REPORTE } from "@/app/_utils/correo-reporte";
import { Cupon } from "@/app/panel/_components/cupon";

/**
 * Synthetic report shown on the landing. Every value is invented and the
 * figure says so; fixed dates keep the page prerenderable.
 */
const EJEMPLO: AnalisisDetalleDTO = {
  id: "ejemplo",
  numero: "000128",
  asunto: "Tu casilla se suspenderá hoy: confirma tu contraseña",
  solicitante: "persona@coplex.cl",
  clasificacion: "PHISHING",
  riesgo: 92,
  estadoEnvio: "ENVIADO",
  analizadoEn: "2026-11-03T13:42:00.000Z",
  enviadoEn: "2026-11-03T13:43:00.000Z",
  critico: true,
  atendido: true,
  anulado: false,
  ultimaAccion: "DOMINIO_BLOQUEADO",
  tecnica: tecnicaAttack("T1598"),
  evidenciaAttack:
    "Pide confirmar la contraseña en una página externa que imita el inicio de sesión: busca credenciales, no ejecutar código.",
  resumen:
    "El mensaje se hace pasar por el soporte de TI, pide confirmar la contraseña con urgencia y enlaza a una página externa que imita el inicio de sesión de la empresa. Es un intento de robo de credenciales.",
  recomendacion:
    "No abras el enlace ni escribas tu contraseña. Si ya lo hiciste, cámbiala de inmediato desde el sitio oficial y avisa al equipo de seguridad.",
  indicadores: [
    {
      id: "1",
      descripcion:
        "Dice venir de «Soporte TI», pero el remitente usa un dominio externo a la empresa.",
    },
    {
      id: "2",
      descripcion:
        "El enlace lleva a una página que pide usuario y contraseña fuera del dominio oficial.",
    },
    {
      id: "3",
      descripcion: "Presión de tiempo: «tu casilla se suspende en 2 horas».",
    },
    {
      id: "4",
      descripcion: "La autenticación del remitente (SPF y DKIM) no superó la verificación.",
    },
  ],
  timbres: [
    {
      id: "e1",
      origen: "SISTEMA",
      tipo: "ANALISIS_FINALIZADO",
      fecha: "2026-11-03T13:42:00.000Z",
      autor: null,
      detalle: "Phishing (92/100)",
    },
    {
      id: "e2",
      origen: "SISTEMA",
      tipo: "AMENAZA_CRITICA",
      fecha: "2026-11-03T13:42:00.000Z",
      autor: null,
      detalle: null,
    },
    {
      id: "e3",
      origen: "SISTEMA",
      tipo: "INFORME_ENVIADO",
      fecha: "2026-11-03T13:43:00.000Z",
      autor: null,
      detalle: null,
    },
    {
      id: "a1",
      origen: "ANALISTA",
      tipo: "DOMINIO_BLOQUEADO",
      fecha: "2026-11-03T13:58:00.000Z",
      autor: "Equipo de seguridad",
      detalle: null,
    },
  ],
};

/** Long after every timestamp, so no row replays its landing animation. */
const AHORA_FIJO = new Date("2026-11-04T00:00:00.000Z");

export function CuponEjemplo() {
  return (
    <figure className="flex flex-col gap-3">
      {/* inert: an illustration, not a second set of controls to tab through. */}
      <div className="relative max-h-[30rem] overflow-hidden sm:max-h-[34rem]" inert>
        <Cupon
          analisis={EJEMPLO}
          esAnalista={false}
          ahora={AHORA_FIJO}
          tituloComo="h2"
          animarVeredicto
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 flex h-10 flex-col justify-end bg-ground"
        >
          <div className="perforation-x" />
          <div className="h-[calc(100%-2px)]" />
        </div>
      </div>
      <figcaption className="text-[0.8rem] leading-relaxed text-mute">
        <span className="tab-caps text-[0.65rem] text-navy">Ejemplo ilustrativo</span>{" "}
        · Así se ve la copia de tu informe. El correo y sus datos son inventados;
        los reales llegan desde {CORREO_REPORTE}.
      </figcaption>
    </figure>
  );
}
