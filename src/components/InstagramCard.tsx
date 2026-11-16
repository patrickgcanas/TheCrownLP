"use client";

import { useRef, useState } from "react";
import InstagramEmbed from "@/components/InstagramEmbed";

// Post do Instagram no visual do site: capa + play. O quadro (branco) do Instagram
// só aparece ao clicar, numa janela por cima da página com fundo escuro.
export default function InstagramCard({
  permalink,
  capa,
  legenda,
}: {
  permalink: string;
  capa: string | null;
  legenda: string | null;
}) {
  const janela = useRef<HTMLDialogElement>(null);
  const [aberto, setAberto] = useState(false);
  const [semCapa, setSemCapa] = useState(!capa);

  const abrir = () => {
    setAberto(true);
    janela.current?.showModal();
  };
  const fechar = () => janela.current?.close();

  return (
    <div>
      <button
        type="button"
        onClick={abrir}
        aria-label={legenda ? `Assistir: ${legenda}` : "Assistir vídeo do Instagram"}
        className="group relative block aspect-[9/16] max-h-[80vh] w-full overflow-hidden rounded-2xl border border-border bg-[linear-gradient(135deg,#4a1748,#1a0c1f)]"
      >
        {capa && !semCapa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capa}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setSemCapa(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-x-0 bottom-6 text-center text-sm text-muted">Assistir no Instagram</span>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          Instagram
        </span>
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent/90 shadow-[0_0_30px_rgb(214_63_184/0.5)] transition group-hover:scale-110">
          <svg viewBox="0 0 24 24" fill="white" className="ml-1 h-7 w-7" aria-hidden>
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </span>
      </button>
      {legenda && <p className="mt-3 px-1 text-sm text-muted">{legenda}</p>}

      <dialog
        ref={janela}
        onClose={() => setAberto(false)}
        onClick={(e) => e.target === janela.current && fechar()}
        className="m-auto w-[min(420px,calc(100vw-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-xl text-foreground hover:border-accent"
        >
          ×
        </button>
        <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl">{aberto && <InstagramEmbed permalink={permalink} />}</div>
      </dialog>
    </div>
  );
}
