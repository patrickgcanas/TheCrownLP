"use client";

import { useActionState } from "react";
import { criarShow, editarShow, type FormState } from "@/lib/admin-actions";
import type { Show } from "@/lib/supabase";

const idleState: FormState = { status: "idle", message: "" };

// Sem `show`: cria um novo. Com `show`: edita os dados dele.
export default function ShowForm({ show }: { show?: Pick<Show, "id" | "nome" | "local" | "data"> }) {
  const [state, action, pending] = useActionState(show ? editarShow : criarShow, idleState);

  return (
    <form action={action} className="space-y-4">
      {show && <input type="hidden" name="id" value={show.id} />}
      <div>
        <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-muted">
          Nome do show
        </label>
        <input id="nome" name="nome" required defaultValue={show?.nome} placeholder="Ex: Bar X" className="field" />
      </div>
      <div>
        <label htmlFor="local" className="mb-1.5 block text-sm font-medium text-muted">
          Local (opcional)
        </label>
        <input id="local" name="local" defaultValue={show?.local ?? ""} placeholder="Ex: São Paulo, SP" className="field" />
      </div>
      <div>
        <label htmlFor="data" className="mb-1.5 block text-sm font-medium text-muted">
          Data
        </label>
        <input id="data" name="data" type="date" required defaultValue={show?.data} className="field [color-scheme:dark]" />
      </div>
      {state.message && (
        <p className={`text-sm ${state.status === "success" ? "text-green-400" : "text-accent"}`}>{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Salvando..." : show ? "Salvar alterações" : "Criar show"}
      </button>
    </form>
  );
}
