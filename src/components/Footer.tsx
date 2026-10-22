import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold tracking-tight text-foreground">
            THE CROWN <span className="text-accent">LP</span>
          </p>
          <p className="mt-1">Tributo a Linkin Park — shows em bares, eventos e prefeituras.</p>
        </div>

        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-foreground">
            Instagram
          </a>
          <a href="#" className="hover:text-foreground">
            YouTube
          </a>
          <a href="#" className="hover:text-foreground">
            WhatsApp
          </a>
          <Link href="/contato" className="hover:text-foreground">
            Contato
          </Link>
        </div>
      </div>
      <p className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        © The Crown LP — Todos os direitos reservados.
      </p>
    </footer>
  );
}
