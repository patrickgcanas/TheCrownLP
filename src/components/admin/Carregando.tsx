export default function Carregando({ linhas = 3 }: { linhas?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: linhas }, (_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-surface" />
      ))}
    </div>
  );
}
