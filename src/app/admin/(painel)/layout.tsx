import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Logo from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { sair } from "@/lib/auth-actions";
import AdminNavLink from "./AdminNavLink";

export const metadata: Metadata = {
  title: "Painel — The Crown LP",
  robots: { index: false, follow: false },
};

async function Pendencias({ tipo }: { tipo: "depoimentos" | "contatos" }) {
  const { supabase } = await requireAdmin();
  const { count } =
    tipo === "depoimentos"
      ? await supabase.from("depoimentos").select("id", { count: "exact", head: true }).eq("aprovado", false)
      : await supabase.from("contato_mensagens").select("id", { count: "exact", head: true }).eq("respondida", false);

  if (!count) return null;
  return (
    <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{count}</span>
  );
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <span className="rounded-md border border-gold-dim px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
              Painel
            </span>
          </div>
          <form action={sair}>
            <button type="submit" className="text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-foreground">
              Sair
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted sm:px-6">
          <AdminNavLink href="/admin/shows">Shows</AdminNavLink>
          <AdminNavLink href="/admin/depoimentos">
            Depoimentos
            <Suspense>
              <Pendencias tipo="depoimentos" />
            </Suspense>
          </AdminNavLink>
          <AdminNavLink href="/admin/contatos">
            Contatos
            <Suspense>
              <Pendencias tipo="contatos" />
            </Suspense>
          </AdminNavLink>
          <Link href="/" target="_blank" className="ml-auto whitespace-nowrap py-3 hover:text-foreground">
            Ver site ↗
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
