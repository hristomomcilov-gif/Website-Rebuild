import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-start justify-center gap-4 px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">This page is not available.</h1>
      <p className="text-ink-muted">The page you requested does not exist in this build.</p>
      <Link href="/" className="min-h-11 text-brand-soft underline-offset-4 hover:underline">
        Return to the homepage
      </Link>
    </main>
  );
}
