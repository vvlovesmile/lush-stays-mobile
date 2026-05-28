"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBookingDraft, type BookingDraft } from "@/lib/bookingDraft";
import { getListingBySlugFromSupabase } from "@/lib/listings";
import { saveBookingOrder } from "@/lib/order";

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
  const [listingMaxGuests, setListingMaxGuests] = useState<number | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    lastNamePinyin: "",
    firstNamePinyin: "",
    email: "",
    wechatId: "",
    note: "",
  });

  useEffect(() => {
    let isActive = true;

    const timer = window.setTimeout(async () => {
      const currentDraft = getBookingDraft();
      const verifiedEmail = window.sessionStorage.getItem("lush_booking_email");

      setDraft(currentDraft);

      if (verifiedEmail) {
        setGuestInfo((current) => ({
          ...current,
          email: verifiedEmail,
        }));
      }

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

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draft,
          guestInfo,
        }),
      });

      const responseText = await response.text();

      let result: { bookingId?: string; createdAt?: string; error?: string } = {};

      try {
        result = JSON.parse(responseText);
      } catch {
        console.error("API did not return JSON:", responseText);
        alert("创建订单失败：接口返回的不是 JSON，请检查 API route 是否正确。");
        return;
      }

      if (!response.ok) {
        console.error(result);
        alert(result.error || "创建订单失败，请稍后重试。");
        return;
      }

      if (!result.bookingId || !result.createdAt) {
        console.error(result);
        alert("创建订单失败：接口返回缺少订单编号。");
        return;
      }

      saveBookingOrder({
        bookingId: result.bookingId,
        createdAt: result.createdAt,
      });

      window.location.href = "/booking/payment";
    } catch (error) {
      console.error(error);
      alert("创建订单失败，请稍后重试。");
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
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(60,85,56,0.14)] text-[10px] text-[var(--forest)]">
              ✓
            </span>
            <span>认证邮箱</span>

            <span className="h-px w-4 bg-[var(--linen)]" />

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--forest)] text-[10px] !text-white">
              2
            </span>
            <span className="text-[var(--forest-dark)]">填写信息</span>

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

          <div className="mt-3 rounded-xl border border-[#d7d7d1] bg-white p-3.5 soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[22px] font-medium text-[var(--forest-dark)]">
              请填写预订信息
            </h1>

            <p className="mt-1 font-[var(--font-jost)] text-[10px] font-light leading-4 text-[var(--sage)]">
              为了确保预订顺利，请填写以下信息。我们会使用这些信息为您确认订单与后续入住服务。
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <label className="block">
                <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                  姓（拼音）
                </span>

                <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                  <input
                    type="text"
                    value={guestInfo.lastNamePinyin}
                    onChange={(event) =>
                      updateField("lastNamePinyin", event.target.value)
                    }
                    placeholder="例如：Zhang"
                    className="h-full w-[133%] origin-left scale-75 bg-transparent px-3 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                  名（拼音）
                </span>

                <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                  <input
                    type="text"
                    value={guestInfo.firstNamePinyin}
                    onChange={(event) =>
                      updateField("firstNamePinyin", event.target.value)
                    }
                    placeholder="例如：San"
                    className="h-full w-[133%] origin-left scale-75 bg-transparent px-3 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                  />
                </div>
              </label>
            </div>

            <label className="mt-2.5 block">
              <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                邮箱地址
              </span>

              <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="请输入邮箱地址"
                  className="h-full w-[133%] origin-left scale-75 bg-transparent px-3 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                />
              </div>
            </label>

            <label className="mt-2.5 block">
              <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                微信号（选填）
              </span>

              <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                <input
                  type="text"
                  value={guestInfo.wechatId}
                  onChange={(event) =>
                    updateField("wechatId", event.target.value)
                  }
                  placeholder="请输入微信号，便于客服联系您"
                  className="h-full w-[133%] origin-left scale-75 bg-transparent px-3 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                />
              </div>
            </label>

            <label className="mt-2.5 block">
              <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                备注（便于客服后续提供服务）
              </span>

              <div className="h-14 w-full overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                <textarea
                  value={guestInfo.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  placeholder="如预计抵达时间，特殊需求等"
                  rows={3}
                  className="h-[133%] w-[133%] origin-left scale-75 resize-none bg-transparent px-3 py-2 font-[var(--font-jost)] text-sm leading-5 text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                />
              </div>
            </label>

            <button
              type="button"
              onClick={handleContinueToPayment}
              className="mx-auto mt-4 flex w-[82%] justify-center rounded-lg bg-[var(--forest)] px-5 py-2.5 font-[var(--font-jost)] text-xs font-medium tracking-[0.08em] !text-white"
            >
              保存并继续支付
            </button>
          </div>

          <p className="mt-4 text-center font-[var(--font-jost)] text-[10px] font-light leading-4 text-[var(--sage)]">
            您的信息安全会有保障，我们将仅用于订单确认与入住服务。
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
