"use client";

import { useActionState, useState } from "react";
import { enviarDepoimento, type ActionState } from "@/lib/actions";

const idleState: ActionState = { status: "idle", message: "" };

export default function DepoimentoForm() {
  const [state, action, pending] = useActionState(enviarDepoimento, idleState);
  const [avaliacao, setAvaliacao] = useState(5);

  return (
    <form action={action} className="space-y-5 rounded-2xl border border-border bg-surface p-8">
      <h2 className="text-xl font-bold">Deixe seu depoimento</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-muted">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="papel" className="mb-1.5 block text-sm font-medium text-muted">
            Local / evento (opcional)
          </label>
          <input
            id="papel"
            name="papel"
            placeholder="Ex: Bar X, casamento, prefeitura de Y"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium text-muted">
          Depoimento
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-muted">Avaliação</span>
        <input type="hidden" name="avaliacao" value={avaliacao} />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setAvaliacao(n)}
              aria-label={`${n} estrelas`}
              className={`text-2xl transition-colors ${n <= avaliacao ? "text-accent" : "text-border"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {state.message && (
        <p className={`text-sm ${state.status === "success" ? "text-green-400" : "text-accent"}`}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-dim disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar depoimento"}
      </button>
    </form>
  );
}
