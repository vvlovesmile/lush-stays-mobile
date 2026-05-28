"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBookingDraft, type BookingDraft } from "@/lib/bookingDraft";
import { getListingBySlugFromSupabase } from "@/lib/listings";
import { supabase } from "@/lib/supabaseClient";


export default function BookingVerifyPage() {
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);

  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [listingMaxGuests, setListingMaxGuests] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    let isActive = true;

    const timer = window.setTimeout(async () => {
      const currentDraft = getBookingDraft();

      setDraft(currentDraft);

      if (!currentDraft) return;

      try {
        const listing = await getListingBySlugFromSupabase(
          currentDraft.listingSlug
        );

        if (isActive) {
          setListingMaxGuests(listing?.maxGuests ?? null);
        }
      } catch (error) {
        console.error(error);

        if (isActive) {
          setListingMaxGuests(null);
        }
      }
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, []);

  const maxGuestCapacity = draft
    ? draft.rooms * (listingMaxGuests ?? draft.guests)
    : 0;

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
      <main className="min-h-screen bg-white">
        <Header />

        <section className="bg-white px-5 py-14">
          <div className="mobile-container rounded-xl border border-[#d7d7d1] bg-white p-6 text-center soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[26px] font-medium text-[var(--forest-dark)]">
              暂无预定信息
            </h1>

            <p className="mt-4 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              请先返回房源详情页，选择入住日期和退房日期后再继续预定。
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-[var(--forest)] px-6 py-3 font-[var(--font-jost)] text-sm font-medium !text-white"
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
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-white px-5 pt-5">
        <div className="mobile-container">
          <div className="mb-4 flex items-center justify-center gap-1.5 font-[var(--font-jost)] text-[9px] text-[var(--sage)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--forest)] text-[10px] !text-white">
              1
            </span>
            <span className="text-[var(--forest-dark)]">认证邮箱</span>
            <span className="h-px w-4 bg-[var(--linen)]" />
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--linen)] text-[10px]">
              2
            </span>
            <span>填写信息</span>
            <span className="h-px w-4 bg-[var(--linen)]" />
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--linen)] text-[10px]">
              3
            </span>
            <span>支付订单</span>
          </div>

          <div className="rounded-xl border border-[#d7d7d1] bg-white p-3 soft-shadow">
            <div className="flex gap-3">
              <img
                src={draft.coverImage}
                alt={draft.listingTitle}
                className="h-14 w-18 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-jost)] text-[9px] uppercase tracking-[0.1em] text-[var(--sage)]">
                  {draft.locationLabel}
                </p>

                <h2 className="mt-1 font-[var(--font-cormorant)] text-sm font-medium leading-snug text-[var(--forest-dark)]">
                  {draft.listingTitle}
                </h2>

                <p className="mt-1 font-[var(--font-jost)] text-[10px] text-[var(--sage)]">
                  {draft.checkin} 至 {draft.checkout}
                </p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-4 gap-1 rounded-lg border border-[rgba(60,85,56,0.14)] px-2 py-1.5">
              <div className="flex items-center justify-center gap-0.5">
                <p className="font-[var(--font-jost)] text-[9px] text-[var(--sage)]">晚数</p>
                <p className="font-[var(--font-jost)] text-[10px] font-medium text-[var(--forest-dark)]">
                  {draft.nights}晚
                </p>
              </div>

              <div className="flex items-center justify-center gap-0.5">
                <p className="font-[var(--font-jost)] text-[9px] text-[var(--sage)]">房间</p>
                <p className="font-[var(--font-jost)] text-[10px] font-medium text-[var(--forest-dark)]">
                  {draft.rooms}间
                </p>
              </div>

              <div className="flex items-center justify-center gap-0.5">
                <p className="font-[var(--font-jost)] text-[9px] text-[var(--sage)]">最多入住</p>
                <p className="font-[var(--font-jost)] text-[10px] font-medium text-[var(--forest-dark)]">
                  {maxGuestCapacity}人
                </p>
              </div>

              <div className="flex items-center justify-center gap-0.5">
                <p className="font-[var(--font-jost)] text-[9px] text-[var(--sage)]">总价</p>
                <p className="font-[var(--font-jost)] text-[10px] font-medium text-[var(--forest-dark)]">
                  ฿{draft.totalPriceThb.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#d7d7d1] bg-white p-5 soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[26px] font-medium text-[var(--forest-dark)]">
              验证您的邮箱
            </h1>

            <p className="mt-2 font-[var(--font-jost)] text-xs font-light leading-5 text-[var(--sage)]">
              我们将向您的邮箱发送验证码，请查收并输入验证码以继续预定流程。
            </p>

            <label className="mt-4 block">
              <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                邮箱地址
              </span>

              <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setHasSentCode(false);
                    setCode("");
                  }}
                  placeholder="请输入邮箱地址"
                  className="h-full w-[133%] origin-left scale-75 bg-transparent px-3 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                />
              </div>
            </label>

            <label className="mt-2.5 block">
              <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                验证码
              </span>

              <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="请输入6位验证码"
                  className="h-full w-[133%] origin-left scale-75 bg-transparent px-3 font-[var(--font-jost)] text-sm tracking-[0.18em] text-[var(--forest-dark)] outline-none placeholder:tracking-normal placeholder:text-[var(--sage-light)]"
                />
              </div>
            </label>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={isSending}
              className="mt-5 w-full rounded-lg bg-[var(--forest)] px-6 py-3 font-[var(--font-jost)] text-sm font-medium tracking-[0.08em] !text-white disabled:opacity-60"
            >
              {isSending ? "发送中..." : hasSentCode ? "重新发送验证码" : "发送验证码"}
            </button>

            <button
              type="button"
              onClick={handleContinue}
              disabled={isVerifying}
              className="mt-2.5 w-full rounded-lg border border-[var(--forest)] bg-white px-6 py-3 font-[var(--font-jost)] text-sm font-medium tracking-[0.08em] text-[var(--forest-dark)] disabled:opacity-60"
            >
              {isVerifying ? "验证中..." : "验证并继续"}
            </button>

            <p className="mt-4 text-center font-[var(--font-jost)] text-[10px] font-light leading-4 text-[var(--sage)]">
              没有收到验证码？请检查垃圾邮件，或稍后点击“重新发送验证码”。
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
