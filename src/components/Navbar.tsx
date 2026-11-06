"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";

const links = [
  { href: "/", label: "Início" },
  { href: "/historia", label: "História" },
  { href: "/midia", label: "Mídia" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.12em] text-muted md:flex">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="border-b-2 pb-1 transition-colors hover:text-foreground"
              activeClassName="border-accent text-foreground"
              inactiveClassName="border-transparent"
            >
              {link.label}
            </NavLink>
          ))}
          <Link href="/contato" className="btn-primary !px-5 !py-2.5">
            Contrate a banda
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground md:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-4 text-sm font-medium uppercase tracking-[0.1em] text-muted md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contato" onClick={() => setOpen(false)} className="btn-primary mt-2">
            Contrate a banda
          </Link>
        </nav>
      )}
    </header>
  );
}
