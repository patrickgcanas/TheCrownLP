"use client";

import { useActionState } from "react";
import { trocarSenha, type FormState } from "@/lib/auth-actions";

const idleState: FormState = { status: "idle", message: "" };

export default function SenhaForm() {
  const [state, action, pending] = useActionState(trocarSenha, idleState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-muted">
          Nova senha
        </label>
        <input id="senha" name="senha" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </div>
      <div>
        <label htmlFor="confirmacao" className="mb-1.5 block text-sm font-medium text-muted">
          Repita a nova senha
        </label>
        <input id="confirmacao" name="confirmacao" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </div>
      {state.status !== "idle" && (
        <p className={`text-sm ${state.status === "ok" ? "text-gold" : "text-accent"}`}>{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Salvando..." : "Trocar senha"}
      </button>
    </form>
  );
}
