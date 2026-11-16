"use client";

import { useActionState } from "react";
import { criarDataAgenda, editarDataAgenda, type FormState } from "@/lib/admin-actions";
import type { DataAgenda } from "@/lib/supabase";

const idleState: FormState = { status: "idle", message: "" };

// Sem `item`: adiciona uma data nova. Com `item`: edita a data existente.
export default function AgendaForm({ item }: { item?: DataAgenda }) {
  const [state, action, pending] = useActionState(item ? editarDataAgenda : criarDataAgenda, idleState);
  const id = (campo: string) => (item ? `${campo}-${item.id}` : campo);

  return (
    <form action={action} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <div>
          <label htmlFor={id("data")} className="mb-1.5 block text-sm font-medium text-muted">
            Data
          </label>
          <input
            id={id("data")}
            name="data"
            type="date"
            required
            defaultValue={item?.data}
            className="field [color-scheme:dark]"
          />
        </div>
        <div>
          <label htmlFor={id("horario")} className="mb-1.5 block text-sm font-medium text-muted">
            Horário
          </label>
          <input
            id={id("horario")}
            name="horario"
            type="time"
            defaultValue={item?.horario?.slice(0, 5)}
            className="field [color-scheme:dark]"
          />
        </div>
      </div>
      <div>
        <label htmlFor={id("local")} className="mb-1.5 block text-sm font-medium text-muted">
          Local ou nome do evento
        </label>
        <input
          id={id("local")}
          name="local"
          required
          maxLength={80}
          defaultValue={item?.local}
          placeholder="Ex: Manifesto Bar"
          className="field"
        />
      </div>
      <div>
        <label htmlFor={id("cidade")} className="mb-1.5 block text-sm font-medium text-muted">
          Cidade (opcional)
        </label>
        <input
          id={id("cidade")}
          name="cidade"
          maxLength={60}
          defaultValue={item?.cidade ?? ""}
          placeholder="Ex: São Paulo, SP"
          className="field"
        />
      </div>
      <div>
        <label htmlFor={id("link")} className="mb-1.5 block text-sm font-medium text-muted">
          Link do evento ou ingressos (opcional)
        </label>
        <input
          id={id("link")}
          name="link"
          inputMode="url"
          defaultValue={item?.link ?? ""}
          placeholder="Ex: post do Instagram, Sympla..."
          className="field"
        />
      </div>
      <div>
        <label htmlFor={id("detalhe")} className="mb-1.5 block text-sm font-medium text-muted">
          Observação (opcional)
        </label>
        <input
          id={id("detalhe")}
          name="detalhe"
          maxLength={120}
          defaultValue={item?.detalhe ?? ""}
          placeholder="Ex: Entrada gratuita"
          className="field"
        />
      </div>
      {state.message && (
        <p className={`text-sm ${state.status === "success" ? "text-green-400" : "text-accent"}`}>{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Salvando..." : item ? "Salvar alterações" : "Adicionar à agenda"}
      </button>
    </form>
  );
}
