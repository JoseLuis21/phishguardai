import { Sello } from "@/app/_components/sello";
import type { AnalisisStubDTO } from "@/app/_interfaces/analisis";
import {
  CLASIFICACION_LABEL,
  CLASIFICACION_TONO,
  ESTADO_ENVIO_LABEL,
} from "@/app/_utils/analisis-labels";

export function SelloClasificacion({
  analisis,
  className,
}: {
  analisis: Pick<AnalisisStubDTO, "clasificacion" | "anulado">;
  className?: string;
}) {
  if (analisis.anulado) {
    return (
      <Sello tono="neutro" linea="tachada" className={className}>
        {CLASIFICACION_LABEL[analisis.clasificacion]}
      </Sello>
    );
  }

  return (
    <Sello tono={CLASIFICACION_TONO[analisis.clasificacion]} className={className}>
      {CLASIFICACION_LABEL[analisis.clasificacion]}
    </Sello>
  );
}

export function SelloEnvio({
  estado,
  className,
}: {
  estado: AnalisisStubDTO["estadoEnvio"];
  className?: string;
}) {
  const linea =
    estado === "ENVIADO"
      ? "continua"
      : estado === "FALLIDO"
        ? "tachada"
        : "discontinua";
  const tono = estado === "FALLIDO" ? "peligro" : "tinta";

  return (
    <Sello tono={tono} linea={linea} className={className}>
      {ESTADO_ENVIO_LABEL[estado]}
    </Sello>
  );
}
