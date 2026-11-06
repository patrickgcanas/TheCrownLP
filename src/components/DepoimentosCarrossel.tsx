"use client";

import { useEffect, useRef, useState } from "react";
import type { Depoimento } from "@/lib/supabase";

function Seta({ direcao, desativada, onClick }: { direcao: "anterior" | "proximo"; desativada: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desativada}
      aria-label={direcao === "anterior" ? "Depoimento anterior" : "Próximo depoimento"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-dim text-gold transition hover:border-gold hover:bg-gold/10 disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
        <path d={direcao === "anterior" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// Depoimentos lado a lado: setas no computador, arrastar com o dedo no celular
export default function DepoimentosCarrossel({ depoimentos }: { depoimentos: Depoimento[] }) {
  const trilho = useRef<HTMLUListElement>(null);
  const [noInicio, setNoInicio] = useState(true);
  const [noFim, setNoFim] = useState(false);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const atualizar = () => {
      setNoInicio(el.scrollLeft <= 4);
      setNoFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    atualizar();
    el.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      el.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, []);

  const mover = (sentido: 1 | -1) => {
    const el = trilho.current;
    const cartao = el?.querySelector("li");
    if (!el || !cartao) return;
    const passo = cartao.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0");
    const suave = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    el.scrollBy({ left: sentido * passo, behavior: suave ? "smooth" : "auto" });
  };

  return (
    <div>
      <ul
        ref={trilho}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {depoimentos.map((d) => (
          <li
            key={d.id}
            className="flex w-full shrink-0 snap-start flex-col rounded-2xl border border-border border-l-4 border-l-gold bg-surface p-7 md:w-[calc((100%-1.25rem)/2)]"
          >
            <div className="tracking-[0.2em] text-gold" aria-label={`${d.avaliacao} de 5 estrelas`}>
              {"★".repeat(d.avaliacao)}
            </div>
            <p className="mt-4 flex-1 text-lg leading-relaxed text-foreground">“{d.mensagem}”</p>
            <p className="mt-6 font-semibold">{d.nome}</p>
            {d.papel && <p className="text-sm text-muted">{d.papel}</p>}
          </li>
        ))}
      </ul>

      {!(noInicio && noFim) && (
        <div className="mt-6 flex gap-3">
          <Seta direcao="anterior" desativada={noInicio} onClick={() => mover(-1)} />
          <Seta direcao="proximo" desativada={noFim} onClick={() => mover(1)} />
        </div>
      )}
    </div>
  );
}
