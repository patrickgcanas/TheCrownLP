"use client";

import { useActionState, useEffect, useState } from "react";
import { criarDataAgenda, editarDataAgenda, type FormState } from "@/lib/admin-actions";
import { reduzirFoto } from "@/lib/reduzir-foto";
import type { DataAgenda } from "@/lib/supabase";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const idleState: FormState = { status: "idle", message: "" };

// Sem `item`: adiciona uma data nova. Com `item`: edita a data existente.
// O cartaz (opcional) sobe do navegador direto para o Storage; o servidor recebe só o caminho.
export default function AgendaForm({ item }: { item?: DataAgenda }) {
  const salvar = item ? editarDataAgenda : criarDataAgenda;
  const [previa, setPrevia] = useState<string | null>(null);
  const [removerCartaz, setRemoverCartaz] = useState(false);

  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData): Promise<FormState> => {
    const arquivo = formData.get("cartaz_arquivo");
    formData.delete("cartaz_arquivo");

    // O React limpa o formulário (inclusive a imagem escolhida) ao terminar; a prévia acompanha
    try {
      if (arquivo instanceof File && arquivo.size > 0) {
        let corpo: Blob;
        try {
          corpo = await reduzirFoto(arquivo, 1600);
        } catch {
          return { status: "error", message: "Formato de imagem não suportado (ex.: HEIC do iPhone). Envie em JPG ou PNG." };
        }
        const caminho = `agenda/${crypto.randomUUID()}.jpg`;
        const { error } = await createBrowserSupabase()
          .storage.from("midia")
          .upload(caminho, corpo, { contentType: "image/jpeg", cacheControl: "31536000" });
        if (error) return { status: "error", message: "Não foi possível enviar o cartaz. Verifique a conexão e tente de novo." };
        formData.set("cartaz_path", caminho);
      }

      const resultado = await salvar(prev, formData);
      if (resultado.status === "success") setRemoverCartaz(false);
      return resultado;
    } finally {
      setPrevia(null);
    }
  }, idleState);

  // Libera a memória da prévia da imagem escolhida
  useEffect(() => () => void (previa && URL.revokeObjectURL(previa)), [previa]);

  const id = (campo: string) => (item ? `${campo}-${item.id}` : campo);
  const cartazAtual = item?.cartaz_url && !removerCartaz ? item.cartaz_url : null;
  const cartazMostrado = previa ?? cartazAtual;

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
      <div>
        <label htmlFor={id("cartaz")} className="mb-1.5 block text-sm font-medium text-muted">
          Cartaz do show (opcional)
        </label>
        <div className="flex items-start gap-3">
          {cartazMostrado && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cartazMostrado}
              alt="Cartaz"
              className="aspect-[3/4] w-16 shrink-0 rounded-lg border border-border object-cover"
            />
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <input
              id={id("cartaz")}
              name="cartaz_arquivo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const arquivo = e.target.files?.[0];
                setPrevia(arquivo ? URL.createObjectURL(arquivo) : null);
              }}
              className="block w-full min-w-0 text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-solid file:border-gold-dim file:bg-transparent file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.08em] file:text-gold hover:file:border-gold"
            />
            <p className="text-xs text-muted">
              {item?.cartaz_url ? "Escolha outra imagem para trocar." : "A mesma arte do Instagram. Em pé (vertical) fica melhor."}
            </p>
            {item?.cartaz_url && !previa && (
              <label className="flex items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  name="remover_cartaz"
                  checked={removerCartaz}
                  onChange={(e) => setRemoverCartaz(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                Remover o cartaz
              </label>
            )}
          </div>
        </div>
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
