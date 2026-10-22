"use client";

import { useActionState } from "react";
import { enviarContato, type ActionState } from "@/lib/actions";

const idleState: ActionState = { status: "idle", message: "" };

const tiposEvento = [
  "Bar / casa de show",
  "Festa privada",
  "Casamento",
  "Evento corporativo",
  "Prefeitura / evento público",
  "Outro",
];

export default function ContatoForm() {
  const [state, action, pending] = useActionState(enviarContato, idleState);

  return (
    <form action={action} className="space-y-5 rounded-2xl border border-border bg-surface p-8">
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
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-muted">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-muted">
            Telefone / WhatsApp (opcional)
          </label>
          <input
            id="telefone"
            name="telefone"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="tipo_evento" className="mb-1.5 block text-sm font-medium text-muted">
            Tipo de evento
          </label>
          <select
            id="tipo_evento"
            name="tipo_evento"
            required
            defaultValue=""
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          >
            <option value="" disabled>
              Selecione
            </option>
            {tiposEvento.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium text-muted">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={5}
          placeholder="Conte um pouco sobre o evento: data, local, duração desejada do show..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
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
        {pending ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
