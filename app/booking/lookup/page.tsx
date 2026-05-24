"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { saveLookupBooking, type BookingRow } from "@/lib/bookings";

export default function BookingLookupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async () => {
    if (!email.trim()) {
      alert("请输入邮箱地址");
      return;
    }

    if (!bookingId.trim()) {
      alert("请输入订单编号");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          bookingId,
        }),
      });

      const responseText = await response.text();

      let result: { booking?: BookingRow; error?: string } = {};

      try {
        result = JSON.parse(responseText);
      } catch {
        console.error("Lookup API did not return JSON:", responseText);
        alert("查询失败：接口返回的不是 JSON，请检查 API route 是否正确。");
        return;
      }

      if (response.status === 404) {
        router.push("/booking/not-found");
        return;
      }

      if (!response.ok) {
        console.error(result);
        alert(result.error || "查询失败，请稍后重试。");
        return;
      }

      if (!result.booking) {
        console.error("Lookup API returned no booking:", result);
        alert("查询失败，请稍后重试。");
        return;
      }

      saveLookupBooking(result.booking);
      router.push("/booking/detail");
    } catch (error) {
      console.error(error);
      alert("查询失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <Header />

      <section className="px-5 py-12">
        <div className="mobile-container">
          <div className="rounded-[30px] border border-[var(--linen)] bg-[var(--card)] p-6 soft-shadow">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(60,85,56,0.08)]">
              <span className="text-3xl">✉️</span>
            </div>

            <h1 className="text-center font-[var(--font-cormorant)] text-[38px] font-medium leading-tight text-[var(--forest-dark)]">
              查看预定详情
            </h1>

            <p className="mx-auto mt-3 max-w-[300px] text-center font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              请输入邮箱地址和订单编号，查看该订单的具体预定信息。
            </p>

            <label className="mt-8 block">
              <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                邮箱地址
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="请输入邮箱地址"
                className="h-14 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm outline-none"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
                订单编号
              </span>

              <input
                type="text"
                value={bookingId}
                onChange={(event) => setBookingId(event.target.value)}
                placeholder="请输入订单编号"
                className="h-14 w-full rounded-2xl border border-[var(--linen)] bg-white px-4 font-[var(--font-jost)] text-sm uppercase outline-none"
              />
            </label>

            <button
              type="button"
              onClick={handleLookup}
              disabled={isLoading}
              className="mt-7 w-full rounded-2xl bg-[var(--forest)] px-6 py-4 font-[var(--font-jost)] text-base font-medium tracking-[0.08em] text-[var(--cream)] disabled:opacity-60"
            >
              {isLoading ? "查询中..." : "查看预定"}
            </button>

            <p className="mt-5 text-center font-[var(--font-jost)] text-xs font-light leading-6 text-[var(--sage)]">
              请输入下单时使用的邮箱地址，并填写对应的订单编号。
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}