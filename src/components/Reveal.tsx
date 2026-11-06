"use client";

import { useEffect, useRef, useState } from "react";

// Faz o conteúdo surgir subindo de leve quando entra na tela (uma vez só).
// O estilo fica no globals.css (.reveal) e é ignorado sem JavaScript ou com "reduzir movimento".
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      // Margem enorme em cima: o que já ficou acima da tela também conta (ex.: ao voltar para a página já rolada)
      { rootMargin: "100000px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visivel ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
