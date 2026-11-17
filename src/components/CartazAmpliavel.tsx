"use client";

import { useRef } from "react";

// Cartaz de um show da agenda: miniatura que abre grande numa janela escura ao clicar
export default function CartazAmpliavel({ src, titulo, className = "" }: { src: string; titulo: string; className?: string }) {
  const janela = useRef<HTMLDialogElement>(null);
  const fechar = () => janela.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => janela.current?.showModal()}
        aria-label={`Ver o cartaz: ${titulo}`}
        className={`group relative block aspect-[3/4] overflow-hidden rounded-xl border border-border bg-surface ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Cartaz: ${titulo}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-2 pb-1.5 pt-5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-gold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          Ampliar
        </span>
      </button>

      <dialog
        ref={janela}
        onClick={(e) => e.target === janela.current && fechar()}
        className="m-auto overflow-visible bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-xl text-foreground hover:border-accent"
        >
          ×
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Cartaz: ${titulo}`}
          className="block max-h-[calc(100vh-7rem)] w-auto max-w-[calc(100vw-2rem)] rounded-2xl"
        />
      </dialog>
    </>
  );
}
