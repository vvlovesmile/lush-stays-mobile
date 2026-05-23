"use client";

import { createBookingFromDraft } from "@/lib/bookings";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBookingDraft, type BookingDraft } from "@/lib/bookingDraft";

type GuestInfo = {
  lastNamePinyin: string;
  firstNamePinyin: string;
  email: string;
  wechatId: string;
  note: string;
};

const GUEST_INFO_KEY = "lush_booking_guest_info";

export default function BookingInfoPage() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    lastNamePinyin: "",
    firstNamePinyin: "",
    email: "",
    wechatId: "",
    note: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentDraft = getBookingDraft();
      const verifiedEmail = window.sessionStorage.getItem("lush_booking_email");

      setDraft(currentDraft);

      if (verifiedEmail) {
        setGuestInfo((current) => ({
          ...current,
          email: verifiedEmail,
        }));
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const updateField = (field: keyof GuestInfo, value: string) => {
    setGuestInfo((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleContinueToPayment = async () => {
    if (!draft) {
      alert("暂无预定信息，请返回房源详情页重新选择。");
      return;
    }

    if (!guestInfo.lastNamePinyin.trim()) {
      alert("请输入姓（拼音）");
      return;
    }

    if (!guestInfo.firstNamePinyin.trim()) {
      alert("请输入名（拼音）");
      return;
    }

    if (!guestInfo.email.trim()) {
      alert("请输入邮箱地址");
      return;
    }

    try {
      window.sessionStorage.setItem(GUEST_INFO_KEY, JSON.stringify(guestInfo));

      await createBookingFromDraft(draft, guestInfo);

      window.location.href = "/booking/payment";
    } catch (error) {
      console.error(error);
      alert("创建订单失败，请稍后重试。");
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
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(60,85,56,0.14)] text-[var(--forest)]">
              ✓
            </span>
            <span>认证邮箱</span>

            <span className="h-px w-8 bg-[var(--linen)]" />

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)]">
              2
            </span>
            <span className="text-[var(--forest-dark)]">填写信息</span>

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
              请填写预订信息
            </h1>

            <p className="mt-3 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              为了确保预订顺利，请填写以下信息。我们会使用这些信息为您确认订单与后续入住服务。
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                  姓（拼音）
                </span>

                <input
                  type="text"
                  value={guestInfo.lastNamePinyin}
                  onChange={(event) =>
                    updateField("lastNamePinyin", event.target.value)
                  }
                  placeholder="例如：Zhang"
                  className="h-13 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                  名（拼音）
                </span>

                <input
                  type="text"
                  value={guestInfo.firstNamePinyin}
                  onChange={(event) =>
                    updateField("firstNamePinyin", event.target.value)
                  }
                  placeholder="例如：San"
                  className="h-13 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm outline-none"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                邮箱地址
              </span>

              <input
                type="email"
                value={guestInfo.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="请输入邮箱地址"
                className="h-13 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm outline-none"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                微信号（选填）
              </span>

              <input
                type="text"
                value={guestInfo.wechatId}
                onChange={(event) =>
                  updateField("wechatId", event.target.value)
                }
                placeholder="请输入微信号，便于客服联系您"
                className="h-13 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm outline-none"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                备注（便于客服后续提供服务）
              </span>

              <textarea
                value={guestInfo.note}
                onChange={(event) => updateField("note", event.target.value)}
                placeholder="如有饮食偏好、抵达时间、特殊需求等，请在此备注"
                rows={5}
                className="w-full resize-none rounded-2xl border border-[var(--linen)] bg-white px-4 py-3 font-[var(--font-jost)] text-sm leading-6 outline-none"
              />
            </label>

            <button
              type="button"
              onClick={handleContinueToPayment}
              className="mt-5 w-full rounded-2xl bg-[var(--forest)] px-6 py-4 font-[var(--font-jost)] text-sm font-medium tracking-[0.08em] text-[var(--cream)]"
            >
              保存并继续支付
            </button>
          </div>

          <p className="mt-5 text-center font-[var(--font-jost)] text-xs font-light leading-6 text-[var(--sage)]">
            您的信息安全会有保障，我们将仅用于订单确认与入住服务。
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
