import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(60,85,56,0.08)] bg-white">
      <div className="mobile-container flex h-16 items-center justify-between px-5">
        <button
          aria-label="打开菜单"
          className="flex h-10 w-10 items-center justify-center"
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 rounded-full bg-[var(--forest-dark)]" />
            <span className="block h-0.5 w-5 rounded-full bg-[var(--forest-dark)]" />
            <span className="block h-0.5 w-5 rounded-full bg-[var(--forest-dark)]" />
          </span>
        </button>

        <Link
          href="/"
          className="font-[var(--font-cormorant)] text-[21px] font-medium tracking-[0.08em] text-[var(--forest-dark)]"
        >
          Lush Stays
        </Link>

        <Link
          href="/booking/lookup"
          className="rounded-md bg-[var(--forest)] px-3.5 py-2 font-[var(--font-jost)] text-xs font-medium !text-white"
        >
          查看预定
        </Link>
      </div>
    </header>
  );
}
