export default function PageHeader({
  eyebrow,
  title,
  highlight,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  children?: React.ReactNode;
}) {
  return (
    <header>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="font-display mt-3 text-5xl leading-none sm:text-6xl">
        {title} {highlight && <span className="text-accent">{highlight}</span>}
      </h1>
      {children && <div className="mt-4 max-w-2xl text-muted">{children}</div>}
    </header>
  );
}
