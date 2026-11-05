"use client";

import { useActionState, useId, useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";
import type { TipoAccion } from "@/app/_interfaces/analisis";
import { CSF_POR_ACCION } from "@/app/_utils/referencias";
import { registrarAccionAction } from "../_actions/registrar-accion.action";

/** NIST CSF 2.0 Respond category the stamp will be filed under. */
function CodigoCsf({ tipo }: { tipo: TipoAccion }) {
  const csf = CSF_POR_ACCION[tipo];
  return (
    <span className="font-normal tracking-normal opacity-75">
      {csf.codigo}
    </span>
  );
}

const LEYENDA_CSF: TipoAccion[] = ["DOMINIO_BLOQUEADO", "BUSQUEDA_TENANT", "ANULADO"];

const ESTADO_INICIAL = { ok: false, mensaje: null as string | null };

export function AccionesCupon({ correoId }: { correoId: string }) {
  const [estado, formAction, pendiente] = useActionState(
    registrarAccionAction,
    ESTADO_INICIAL,
  );
  const [confirmando, setConfirmando] = useState(false);
  const notaId = useId();
  const avisoId = useId();

  return (
    <form
      action={(formData) => {
        setConfirmando(false);
        formAction(formData);
      }}
      className="flex flex-col gap-4"
      aria-describedby={avisoId}
    >
      <input type="hidden" name="correoId" value={correoId} />

      <div className="flex flex-col gap-2">
        <Label htmlFor={notaId}>Nota para la bitácora (opcional)</Label>
        <textarea
          id={notaId}
          name="detalle"
          rows={2}
          maxLength={1000}
          placeholder="Ej.: dominio bloqueado en el gateway de correo"
          className="min-h-16 w-full resize-y rounded-none border border-hairline bg-field px-3 py-2 text-[0.95rem] text-ink outline-none placeholder:text-mute focus-visible:border-navy focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-navy"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" name="tipo" value="DOMINIO_BLOQUEADO" disabled={pendiente}>
          Timbrar dominio bloqueado
          <CodigoCsf tipo="DOMINIO_BLOQUEADO" />
        </Button>
        <Button
          type="submit"
          name="tipo"
          value="BUSQUEDA_TENANT"
          variant="outline"
          disabled={pendiente}
        >
          Timbrar búsqueda en el tenant
          <CodigoCsf tipo="BUSQUEDA_TENANT" />
        </Button>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:pl-10">
          {confirmando ? (
            <>
              <span className="text-[0.85rem] text-ink">¿Es un falso positivo?</span>
              <Button
                type="submit"
                name="tipo"
                value="ANULADO"
                variant="destructive-solid"
                disabled={pendiente}
              >
                Confirmar anulación
                <CodigoCsf tipo="ANULADO" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmando(false)}
                disabled={pendiente}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setConfirmando(true)}
              disabled={pendiente}
            >
              Anular análisis
            </Button>
          )}
        </div>
      </div>

      <div id={avisoId} className="flex flex-col gap-1.5 text-[0.8rem] leading-relaxed text-mute">
        <p aria-live="polite" className="empty:hidden">
          {pendiente ? "Timbrando…" : ""}
        </p>
        <p>
          El código junto a cada botón es la categoría del{" "}
          <span className="font-semibold text-ink">NIST CSF 2.0</span>, el marco
          de ciberseguridad con el que se documenta la respuesta a un incidente:
        </p>
        <ul className="flex flex-col gap-0.5">
          {LEYENDA_CSF.map((tipo) => (
            <li key={tipo}>
              <span className="carbon font-semibold">{CSF_POR_ACCION[tipo].codigo}</span>{" "}
              · {CSF_POR_ACCION[tipo].nombre}: {CSF_POR_ACCION[tipo].explicacion}.
            </li>
          ))}
        </ul>
        <p>
          Los timbres son un registro: no ejecutan el bloqueo en el gateway ni la
          búsqueda en el tenant.
        </p>
      </div>

      <p role="alert" className="min-h-0 text-[0.85rem] font-semibold text-jet-red empty:hidden">
        {!estado.ok && estado.mensaje ? estado.mensaje : ""}
      </p>
    </form>
  );
}
