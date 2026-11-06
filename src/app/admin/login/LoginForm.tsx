"use client";

import { useActionState } from "react";
import { entrar, type FormState } from "@/lib/auth-actions";

const idleState: FormState = { status: "idle", message: "" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(entrar, idleState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-muted">
          E-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-muted">
          Senha
        </label>
        <input id="senha" name="senha" type="password" required autoComplete="current-password" className="field" />
      </div>
      {state.status === "error" && <p className="text-sm text-accent">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
