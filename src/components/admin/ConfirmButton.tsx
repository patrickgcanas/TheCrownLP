"use client";

// Botão de envio que pede confirmação antes de ações sem volta (excluir)
export default function ConfirmButton({
  mensagem,
  className,
  children,
}: {
  mensagem: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(mensagem)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
