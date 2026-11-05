import Link from "next/link";

type EstadoNoValido = "invalido" | "expirado" | "usado";

const TEXTOS: Record<EstadoNoValido, { titulo: string; detalle: string }> = {
  invalido: {
    titulo: "Este enlace no es válido",
    detalle:
      "Puede que esté incompleto o que hayas pedido uno más nuevo. Abre el enlace del último correo que te enviamos.",
  },
  expirado: {
    titulo: "Este enlace venció",
    detalle:
      "Los enlaces duran 24 horas. Regístrate otra vez con el mismo correo y te enviaremos uno nuevo.",
  },
  usado: {
    titulo: "Este enlace ya se usó",
    detalle: "Si activaste la cuenta, ya puedes iniciar sesión.",
  },
};

export function EstadoEnlace({ estado }: { estado: EstadoNoValido }) {
  const { titulo, detalle } = TEXTOS[estado];
  const destino =
    estado === "usado"
      ? { href: "/login", texto: "Ir a iniciar sesión" }
      : { href: "/registro", texto: "Pedir un enlace nuevo" };

  return (
    <div role="status" className="flex flex-col gap-4">
      <p className="text-[1.05rem] font-semibold text-ink">{titulo}</p>
      <p className="max-w-[46ch] text-[0.92rem] leading-relaxed text-mute">
        {detalle}
      </p>
      <Link
        href={destino.href}
        className="text-[0.92rem] font-semibold text-navy underline"
      >
        {destino.texto}
      </Link>
    </div>
  );
}
