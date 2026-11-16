import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { EMAIL_BANDA, whatsappUrl } from "@/lib/contatos";
import { INSTAGRAM_USUARIO } from "@/lib/instagram";

export const metadata: Metadata = {
  title: "Contato — The Crown LP",
  description: "Fale com a The Crown LP, tributo a Linkin Park, pelo Instagram, WhatsApp ou e-mail.",
};

const icones = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" strokeLinejoin="round" />
      <path d="M9 9.2c.3 2.4 2.4 4.6 5 5.2l1.2-1.3-1.8-.9-.8.8c-1-.4-1.9-1.3-2.3-2.3l.8-.8-.9-1.8z" fill="currentColor" stroke="none" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" strokeLinejoin="round" />
    </svg>
  ),
};

const meios = [
  {
    nome: "Instagram",
    detalhe: `@${INSTAGRAM_USUARIO}`,
    texto: "Manda um direct pra gente.",
    href: `https://ig.me/m/${INSTAGRAM_USUARIO}`,
    icone: icones.instagram,
  },
  whatsappUrl && {
    nome: "WhatsApp",
    detalhe: "Resposta mais rápida",
    texto: "Chama a gente no WhatsApp.",
    href: whatsappUrl,
    icone: icones.whatsapp,
  },
  {
    nome: "E-mail",
    detalhe: EMAIL_BANDA,
    texto: "Escreve pra gente.",
    href: `mailto:${EMAIL_BANDA}`,
    icone: icones.email,
  },
].filter((m) => !!m);

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow="Contato" title="FALE COM A" highlight="GENTE">
        Escolha o jeito mais fácil pra você. A gente responde o mais rápido possível.
      </PageHeader>

      <ul className={`mt-10 grid gap-4 ${meios.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {meios.map((m) => (
          <li key={m.nome}>
            <a
              href={m.href}
              target={m.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <span className="text-gold transition-colors group-hover:text-accent">{m.icone}</span>
              <span className="font-display mt-4 text-3xl leading-none">{m.nome}</span>
              <span className="mt-1 break-all text-sm text-accent">{m.detalhe}</span>
              <span className="mt-3 text-sm text-muted">{m.texto}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold-dim bg-gold/5 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-2xl leading-none">QUER UM SHOW DA THE CROWN LP?</p>
          <p className="mt-2 text-sm text-muted">Conta os detalhes do seu evento e a gente manda uma proposta.</p>
        </div>
        <Link href="/contrate" className="btn-primary shrink-0">
          Contrate a banda
        </Link>
      </div>
    </div>
  );
}
