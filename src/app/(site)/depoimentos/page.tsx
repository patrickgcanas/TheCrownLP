import type { Metadata } from "next";
import DepoimentoForm from "@/components/DepoimentoForm";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Depoimentos — The Crown LP",
  description: "Foi a um show da The Crown LP? Deixe seu depoimento.",
};

export default function DepoimentosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow="Depoimentos" title="VIU O SHOW?" highlight="CONTA PRA GENTE">
        Seu depoimento aparece na página inicial do site depois de uma revisão rápida da banda.
      </PageHeader>

      <div className="mt-10">
        <DepoimentoForm />
      </div>
    </div>
  );
}
