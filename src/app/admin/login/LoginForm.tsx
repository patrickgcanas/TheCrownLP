"use client";

import { useActionState } from "react";
import { enviarLinkDeAcesso, type LoginState } from "@/lib/auth-actions";

const idleState: LoginState = { status: "idle", message: "" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(enviarLinkDeAcesso, idleState);

  if (state.status === "sent") {
    return (
      <div className="rounded-lg border border-gold-dim bg-gold/10 px-4 py-4 text-sm">
        <p className="font-display text-2xl text-gold">CONFIRA SEU E-MAIL</p>
        <p className="mt-1 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-muted">
          E-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      {state.status === "error" && <p className="text-sm text-accent">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Enviando..." : "Receber link de acesso"}
      </button>
    </form>
  );
}
