"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_ID = "instagram-embed-js";

// Post do Instagram no formato oficial: o script do Instagram troca o bloco por um iframe
// com a altura certa do post (sem barra de rolagem por dentro)
export default function InstagramEmbed({ permalink }: { permalink: string }) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [permalink]);

  return (
    <div className="overflow-hidden rounded-2xl">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        // Estilo recomendado pelo Instagram: sem a largura mínima, o post é desenhado espremido
        style={{ background: "#fff", border: 0, margin: 0, maxWidth: 540, minWidth: 326, padding: 0, width: "100%" }}
      >
        <a
          href={permalink}
          target="_blank"
          rel="noreferrer"
          className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-border text-sm text-muted hover:text-foreground"
        >
          Ver no Instagram
        </a>
      </blockquote>
    </div>
  );
}
