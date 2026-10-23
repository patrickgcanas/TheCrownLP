import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo size={36} />
          <p className="mt-3">Tributo a Linkin Park — shows em bares, eventos e prefeituras.</p>
          <p className="font-display mt-1 text-lg tracking-[0.18em] text-gold">HEAVY IS THE CROWN</p>
        </div>

        <div className="flex items-center gap-5 uppercase tracking-[0.1em] text-xs">
          <a href="#" className="hover:text-foreground">
            Instagram
          </a>
          <a href="#" className="hover:text-foreground">
            WhatsApp
          </a>
          <Link href="/contato" className="hover:text-foreground">
            Contato
          </Link>
        </div>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        © The Crown LP — Todos os direitos reservados.
      </p>
    </footer>
  );
}
