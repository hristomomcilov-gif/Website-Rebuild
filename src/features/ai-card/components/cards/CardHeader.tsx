export function CardHeader({ index, label, title, titleId }: { index: number; label: string; title: string; titleId: string }) {
  return (
    <header className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">
        {index} · {label}
      </p>
      <h2 id={titleId} className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
        {title}
      </h2>
    </header>
  );
}
