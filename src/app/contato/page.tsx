import type { Metadata } from "next";
import ContatoForm from "@/components/ContatoForm";

export const metadata: Metadata = {
  title: "Contato — The Crown LP",
  description: "Contrate a The Crown LP, tributo a Linkin Park, para seu bar, evento ou apresentação pública.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Contato</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Vamos marcar um show?</h1>
      <p className="mt-4 text-muted">
        Preencha o formulário com os detalhes do seu evento e a gente retorna o
        mais rápido possível com uma proposta.
      </p>

      <div className="mt-10">
        <ContatoForm />
      </div>
    </div>
  );
}
