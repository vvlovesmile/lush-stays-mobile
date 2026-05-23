import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function BookingNotFoundPage() {
  return (
    <main className="page-shell">
      <Header />

      <section className="px-5 py-16">
        <div className="mobile-container text-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[rgba(60,85,56,0.06)]">
            <span className="text-6xl">🔍</span>
          </div>

          <h1 className="mt-8 font-[var(--font-cormorant)] text-[42px] font-medium leading-tight text-[var(--forest-dark)]">
            未找到该订单
          </h1>

          <p className="mx-auto mt-4 max-w-[320px] font-[var(--font-jost)] text-base font-light leading-8 text-[var(--forest-dark)]">
            请检查输入的邮箱地址或订单编号是否正确。
          </p>

          <Link
            href="/booking/lookup"
            className="mt-8 flex w-full items-center justify-center rounded-2xl bg-[var(--forest)] px-6 py-4 font-[var(--font-jost)] text-base font-medium tracking-[0.08em] text-[var(--cream)]"
          >
            重新输入
          </Link>

          <Link
            href="/"
            className="mt-5 inline-flex font-[var(--font-jost)] text-base text-[var(--forest-dark)] underline underline-offset-4"
          >
            返回首页
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}