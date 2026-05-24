"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBookingDraft, type BookingDraft } from "@/lib/bookingDraft";
import { supabase } from "@/lib/supabaseClient";


export default function BookingVerifyPage() {
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);

  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDraft(getBookingDraft());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      alert("请输入邮箱地址");
      return;
    }

    try {
      setIsSending(true);

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error(error);
        alert(error.message || "验证码发送失败，请稍后重试。");
        return;
      }

      setEmail(normalizedEmail);
      setHasSentCode(true);
      alert("验证码已发送，请检查您的邮箱。");
    } catch (error) {
      console.error(error);
      alert("验证码发送失败，请稍后重试。");
    } finally {
      setIsSending(false);
    }
  };

  const handleContinue = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!normalizedEmail) {
      alert("请输入邮箱地址");
      return;
    }

    if (!normalizedCode) {
      alert("请输入验证码");
      return;
    }

    if (!hasSentCode) {
      alert("请先点击发送验证码。");
      return;
    }

    try {
      setIsVerifying(true);

      const { error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: normalizedCode,
        type: "email",
      });

      if (error) {
        console.error(error);
        alert(error.message || "验证码错误或已过期，请重新输入。");
        return;
      }

      window.sessionStorage.setItem("lush_booking_email", normalizedEmail);
      router.push("/booking/info");
    } catch (error) {
      console.error(error);
      alert("邮箱验证失败，请稍后重试。");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!draft) {
    return (
      <main className="page-shell">
        <Header />

        <section className="px-5 py-14">
          <div className="mobile-container rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-6 text-center soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[32px] font-medium text-[var(--forest-dark)]">
              暂无预定信息
            </h1>

            <p className="mt-4 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              请先返回房源详情页，选择入住日期和退房日期后再继续预定。
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[var(--forest)] px-6 py-3 font-[var(--font-jost)] text-sm font-medium text-[var(--cream)]"
            >
              返回首页
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Header />

      <section className="px-5 pt-7">
        <div className="mobile-container">
          <div className="mb-6 flex items-center justify-center gap-2 font-[var(--font-jost)] text-xs text-[var(--sage)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)]">
              1
            </span>
            <span className="text-[var(--forest-dark)]">认证邮箱</span>
            <span className="h-px w-8 bg-[var(--linen)]" />
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--linen)]">
              2
            </span>
            <span>填写信息</span>
            <span className="h-px w-8 bg-[var(--linen)]" />
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--linen)]">
              3
            </span>
            <span>支付订单</span>
          </div>

          <div className="rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-4 soft-shadow">
            <div className="flex gap-4">
              <img
                src={draft.coverImage}
                alt={draft.listingTitle}
                className="h-24 w-28 rounded-2xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-jost)] text-[11px] uppercase tracking-[0.12em] text-[var(--sage)]">
                  {draft.locationLabel}
                </p>

                <h2 className="mt-1 font-[var(--font-cormorant)] text-[24px] font-medium leading-tight text-[var(--forest-dark)]">
                  {draft.listingTitle}
                </h2>

                <p className="mt-2 font-[var(--font-jost)] text-xs text-[var(--sage)]">
                  {draft.checkin} 至 {draft.checkout}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 rounded-[20px] bg-[rgba(60,85,56,0.06)] p-4 text-center">
              <div>
                <p className="font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
                  晚数
                </p>
                <p className="mt-1 font-[var(--font-cormorant)] text-xl font-medium text-[var(--forest-dark)]">
                  {draft.nights}晚
                </p>
              </div>

              <div>
                <p className="font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
                  房间
                </p>
                <p className="mt-1 font-[var(--font-cormorant)] text-xl font-medium text-[var(--forest-dark)]">
                  {draft.rooms}间
                </p>
              </div>

              <div>
                <p className="font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
                  总价
                </p>
                <p className="mt-1 font-[var(--font-cormorant)] text-xl font-medium text-[var(--forest-dark)]">
                  ฿{draft.totalPriceThb.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-6 soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[34px] font-medium text-[var(--forest-dark)]">
              验证您的邮箱
            </h1>

            <p className="mt-3 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              我们将向您的邮箱发送验证码，请查收并输入验证码以继续预定流程。
            </p>

            <label className="mt-6 block">
              <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                邮箱地址
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setHasSentCode(false);
                  setCode("");
                }}
                placeholder="请输入邮箱地址"
                className="h-13 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm outline-none"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                验证码
              </span>

              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="请输入6位验证码"
                className="h-13 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm outline-none"
              />
              
            </label>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={isSending}
              className="mt-5 w-full rounded-2xl bg-[var(--forest)] px-6 py-4 font-[var(--font-jost)] text-sm font-medium tracking-[0.08em] text-[var(--cream)] disabled:opacity-60"
            >
              {isSending ? "发送中..." : hasSentCode ? "重新发送验证码" : "发送验证码"}
            </button>

            <button
              type="button"
              onClick={handleContinue}
              disabled={isVerifying}
              className="mt-3 w-full rounded-2xl border border-[var(--forest)] px-6 py-4 font-[var(--font-jost)] text-sm font-medium tracking-[0.08em] text-[var(--forest-dark)] disabled:opacity-60"
            >
              {isVerifying ? "验证中..." : "验证并继续"}
            </button>

            <p className="mt-5 text-center font-[var(--font-jost)] text-xs font-light text-[var(--sage)]">
              没有收到验证码？请检查垃圾邮件，或稍后点击“重新发送验证码”。
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
