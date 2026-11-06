"use client";

import { useCallback, useEffect, useState } from "react";

type Foto = { id: string; url: string; legenda: string | null };

export default function PhotoGallery({ fotos }: { fotos: Foto[] }) {
  const [aberta, setAberta] = useState<number | null>(null);

  const fechar = useCallback(() => setAberta(null), []);
  const mover = useCallback(
    (passo: number) => setAberta((i) => (i === null ? i : (i + passo + fotos.length) % fotos.length)),
    [fotos.length],
  );

  useEffect(() => {
    if (aberta === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aberta, fechar, mover]);

  const atual = aberta === null ? null : fotos[aberta];

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {fotos.map((foto, i) => (
          <button
            key={foto.id}
            type="button"
            onClick={() => setAberta(i)}
            className="group mb-3 block w-full overflow-hidden rounded-xl border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto.url}
              alt={foto.legenda ?? ""}
              loading="lazy"
              className="w-full transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {atual && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur"
          onClick={fechar}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={atual.url}
            alt={atual.legenda ?? ""}
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-[0_0_60px_rgb(214_63_184/0.25)]"
            onClick={(e) => e.stopPropagation()}
          />
          {atual.legenda && (
            <p className="absolute inset-x-0 bottom-6 px-4 text-center text-sm text-muted">{atual.legenda}</p>
          )}
          <button type="button" aria-label="Fechar" onClick={fechar} className="absolute right-4 top-4 text-3xl text-foreground">
            ×
          </button>
          {fotos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  mover(-1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/80 px-4 py-2 text-2xl sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                onClick={(e) => {
                  e.stopPropagation();
                  mover(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/80 px-4 py-2 text-2xl sm:right-6"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
