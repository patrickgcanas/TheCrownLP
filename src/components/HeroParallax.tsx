"use client";

import { useEffect, useRef } from "react";

// Topo com profundidade: ao rolar, o texto sobe mais rápido que o vídeo e o fundo escurece
export default function HeroParallax({ children, className }: { children: React.ReactNode; className?: string }) {
  const conteudo = useRef<HTMLDivElement>(null);
  const sombra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const video = sombra.current?.parentElement?.querySelector("video");
    let quadro = 0;

    const atualizar = () => {
      quadro = 0;
      const y = window.scrollY;
      const progresso = Math.min(y / window.innerHeight, 1);
      if (conteudo.current) {
        conteudo.current.style.transform = `translate3d(0, ${y * -0.25}px, 0)`;
        conteudo.current.style.opacity = String(1 - progresso * 1.2);
      }
      if (sombra.current) sombra.current.style.opacity = String(progresso * 0.75);
      if (video) video.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(1.05)`;
    };

    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <>
      <div ref={sombra} className="pointer-events-none absolute inset-0 z-[1] bg-background opacity-0" />
      <div ref={conteudo} className={className}>
        {children}
      </div>
    </>
  );
}
