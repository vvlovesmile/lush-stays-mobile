import Link from "next/link";

export function Footer() {
  return (
    <footer className="h-16 bg-white">
      <div className="mobile-container flex h-full items-center justify-center px-5 font-[var(--font-jost)] text-sm font-light text-[var(--sage)]">
        <span>Lush Stays</span>
        <span className="mx-2">·</span>
        <Link href="/privacy">隐私政策</Link>
      </div>
    </footer>
  );
}
