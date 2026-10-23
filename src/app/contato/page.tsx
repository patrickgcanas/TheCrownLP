import type { Metadata } from "next";
import ContatoForm from "@/components/ContatoForm";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Contato — The Crown LP",
  description: "Contrate a The Crown LP, tributo a Linkin Park, para seu bar, evento ou apresentação pública.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow="Contato" title="VAMOS MARCAR UM" highlight="SHOW?">
        Preencha o formulário com os detalhes do seu evento e a gente retorna o
        mais rápido possível com uma proposta.
      </PageHeader>

      <div className="mt-10">
        <ContatoForm />
      </div>
    </div>
  );
}
