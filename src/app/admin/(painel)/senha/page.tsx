import { Suspense } from "react";
import Carregando from "@/components/admin/Carregando";
import { requireAdmin } from "@/lib/auth";
import SenhaForm from "./SenhaForm";

async function Formulario() {
  await requireAdmin();
  return <SenhaForm />;
}

export default function SenhaPage() {
  return (
    <div className="max-w-sm">
      <h1 className="font-display text-5xl leading-none">
        TROCAR <span className="text-accent">SENHA</span>
      </h1>
      <p className="mt-2 text-sm text-muted">
        A senha vale para todos da banda. Depois de trocar, avise o pessoal.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <Suspense fallback={<Carregando />}>
          <Formulario />
        </Suspense>
      </div>
    </div>
  );
}
