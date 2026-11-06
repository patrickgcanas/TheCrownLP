"use client";

import { useActionState, useEffect, useRef } from "react";
import { adicionarInstagram, type FormState } from "@/lib/admin-actions";

const idleState: FormState = { status: "idle", message: "" };

export default function InstagramForm({ showId }: { showId: string }) {
  const [state, action, pending] = useActionState(adicionarInstagram, idleState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="show_id" value={showId} />
      <input
        name="link"
        required
        placeholder="https://www.instagram.com/reel/..."
        className="field"
        aria-label="Link do post do Instagram"
      />
      <input name="titulo" placeholder="Legenda (opcional) — ex: Numb ao vivo" className="field" aria-label="Legenda" />
      {state.message && (
        <p className={`text-sm ${state.status === "success" ? "text-green-400" : "text-accent"}`}>{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-ghost w-full">
        {pending ? "Adicionando..." : "Adicionar post"}
      </button>
    </form>
  );
}
