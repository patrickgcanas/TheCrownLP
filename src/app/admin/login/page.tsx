import type { Metadata } from "next";
import { Suspense } from "react";
import Logo from "@/components/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Painel — The Crown LP",
  robots: { index: false, follow: false },
};

const erros: Record<string, string> = {
  acesso: "Esse e-mail não tem acesso ao painel.",
  link: "O link expirou ou já foi usado. Peça um novo abaixo.",
};

async function ErroMensagem({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { erro } = await searchParams;
  const mensagem = typeof erro === "string" ? erros[erro] : undefined;
  if (!mensagem) return null;
  return <p className="mb-5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-foreground">{mensagem}</p>;
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="flex flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_50%_0%,rgb(214_63_184/0.18),transparent_60%)] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size={48} />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-7">
          <h1 className="font-display text-4xl leading-none">
            PAINEL DA <span className="text-accent">BANDA</span>
          </h1>
          <p className="mt-2 text-sm text-muted">Digite o e-mail da banda e enviamos um link de acesso. Sem senha.</p>
          <div className="mt-6">
            <Suspense>
              <ErroMensagem searchParams={searchParams} />
            </Suspense>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
