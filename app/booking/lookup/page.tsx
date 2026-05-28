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
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-white px-5 pb-10 pt-6">
        <div className="mobile-container">
          <div className="rounded-xl border border-[#d7d7d1] bg-white p-4 soft-shadow">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(60,85,56,0.14)] bg-[rgba(60,85,56,0.04)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[var(--forest)]"
                fill="none"
              >
                <path
                  d="M7.5 4.75h9a1.75 1.75 0 0 1 1.75 1.75v12.3l-2.1-1.25-2.1 1.25-2.05-1.25-2.05 1.25-2.1-1.25-2.1 1.25V6.5A1.75 1.75 0 0 1 7.5 4.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8.25h6M9 11.25h3.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M15.1 14.35c-.85-.72-2.1-.13-2.1.96 0 1.3 2.1 2.24 2.1 2.24s2.1-.94 2.1-2.24c0-1.09-1.25-1.68-2.1-.96Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <h1 className="text-center font-[var(--font-cormorant)] text-[28px] font-medium leading-tight text-[var(--forest-dark)]">
              查看预定详情
            </h1>

            <p className="mx-auto mt-2 max-w-[280px] text-center font-[var(--font-jost)] text-[11px] font-light leading-5 text-[var(--sage)]">
              请输入邮箱地址和订单编号，查看该订单的具体预定信息。
            </p>

            <label className="mt-5 block">
              <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                邮箱地址
              </span>

              <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="请输入邮箱地址"
                  className="h-full w-[133%] origin-left scale-75 border-0 bg-transparent px-3 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                />
              </div>
            </label>

            <label className="mt-3 block">
              <span className="mb-1 block font-[var(--font-jost)] text-[11px] font-medium text-[var(--forest-dark)]">
                订单编号
              </span>

              <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-[#d7d7d1] bg-white focus-within:border-[var(--forest)]">
                <input
                  type="text"
                  value={bookingId}
                  onChange={(event) => setBookingId(event.target.value)}
                  placeholder="请输入订单编号"
                  className="h-full w-[133%] origin-left scale-75 border-0 bg-transparent px-3 font-[var(--font-jost)] text-sm uppercase text-[var(--forest-dark)] outline-none placeholder:text-[var(--sage-light)]"
                />
              </div>
            </label>

            <button
              type="button"
              onClick={handleLookup}
              disabled={isLoading}
              className="mx-auto mt-5 flex w-[82%] justify-center rounded-lg bg-[var(--forest)] px-5 py-2.5 font-[var(--font-jost)] text-xs font-medium tracking-[0.08em] !text-white disabled:opacity-60"
            >
              {isLoading ? "查询中..." : "查看预定"}
            </button>

            <p className="mt-3 text-center font-[var(--font-jost)] text-[10px] font-light leading-5 text-[var(--sage)]">
              请输入下单时使用的邮箱地址，并填写对应的订单编号。
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
