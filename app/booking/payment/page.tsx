"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { type BookingRow } from "@/lib/bookings";
import { getBookingOrder } from "@/lib/order";

const EXCHANGE_RATE = 0.21;

export default function BookingPaymentPage() {
  const [booking, setBooking] = useState<BookingRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      try {
        const currentOrder = getBookingOrder();

        if (!currentOrder?.bookingId) {
          setBooking(null);
          return;
        }

        const response = await fetch("/api/bookings/payment-opened", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: currentOrder.bookingId,
          }),
        });

        const responseText = await response.text();

        let result: { booking?: BookingRow; error?: string } = {};

        try {
          result = JSON.parse(responseText);
        } catch {
          console.error("Payment API did not return JSON:", responseText);
          setBooking(null);
          return;
        }

        if (!response.ok) {
          console.error(result);
          setBooking(null);
          return;
        }

        if (!result.booking) {
          console.error("Payment API returned no booking:", result);
          setBooking(null);
          return;
        }

        setBooking(result.booking);
      } catch (error) {
        console.error(error);
        setBooking(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadBooking();
  }, []);

  const totalCny = useMemo(() => {
    if (!booking) return 0;

    if (booking.total_price_cny) {
      return Number(booking.total_price_cny);
    }

    return Number((booking.total_price_thb * EXCHANGE_RATE).toFixed(2));
  }, [booking]);

  const handleCopyBookingId = async () => {
    if (!booking?.booking_id) return;

    try {
      await navigator.clipboard.writeText(booking.booking_id);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      alert("复制失败，请手动复制订单编号");
    }
  };

  if (isLoading) {
    return (
      <main className="page-shell">
        <Header />

        <section className="px-5 py-14">
          <div className="mobile-container rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-6 text-center soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[32px] font-medium text-[var(--forest-dark)]">
              正在加载支付信息
            </h1>

            <p className="mt-4 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              请稍候，我们正在为您读取订单信息。
            </p>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="page-shell">
        <Header />

        <section className="px-5 py-14">
          <div className="mobile-container rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-6 text-center soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[32px] font-medium text-[var(--forest-dark)]">
              暂无支付信息
            </h1>

            <p className="mt-4 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              请先完成房源选择、邮箱验证与预订信息填写后，再进入支付页面。
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

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(60,85,56,0.14)] text-[var(--forest)]">
              ✓
            </span>
            <span>填写信息</span>

            <span className="h-px w-8 bg-[var(--linen)]" />

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)]">
              3
            </span>
            <span className="text-[var(--forest-dark)]">支付订单</span>
          </div>

          <div className="rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-4 soft-shadow">
            <div className="flex gap-4">
              <img
                src={booking.listing_cover_image ?? ""}
                alt={booking.listing_title}
                className="h-24 w-28 rounded-2xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-jost)] text-[11px] uppercase tracking-[0.12em] text-[var(--sage)]">
                  {booking.location_label}
                </p>

                <h2 className="mt-1 font-[var(--font-cormorant)] text-[24px] font-medium leading-tight text-[var(--forest-dark)]">
                  {booking.listing_title}
                </h2>

                <p className="mt-2 font-[var(--font-jost)] text-xs text-[var(--sage)]">
                  {booking.checkin_date} 至 {booking.checkout_date}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 rounded-[20px] bg-[rgba(60,85,56,0.06)] p-4 text-center">
              <div>
                <p className="font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
                  晚数
                </p>
                <p className="mt-1 font-[var(--font-cormorant)] text-xl font-medium text-[var(--forest-dark)]">
                  {booking.nights}晚
                </p>
              </div>

              <div>
                <p className="font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
                  房间
                </p>
                <p className="mt-1 font-[var(--font-cormorant)] text-xl font-medium text-[var(--forest-dark)]">
                  {booking.num_rooms}间
                </p>
              </div>

              <div>
                <p className="font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
                  入住人
                </p>
                <p className="mt-1 font-[var(--font-cormorant)] text-xl font-medium text-[var(--forest-dark)]">
                  {booking.num_guests}人
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-6 soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[34px] font-medium leading-tight text-[var(--forest-dark)]">
              请完成支付
            </h1>

            <p className="mt-3 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              订单已为您暂时保留，请使用支付宝扫码完成支付。支付时请务必备注订单编号，方便我们为您确认订单。
            </p>

            <div className="mt-6 rounded-[24px] bg-[rgba(60,85,56,0.06)] p-4">
              <p className="font-[var(--font-jost)] text-xs text-[var(--sage)]">
                订单编号
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-[var(--font-cormorant)] text-[28px] font-semibold text-[var(--forest-dark)]">
                  {booking.booking_id}
                </p>

                <button
                  type="button"
                  onClick={handleCopyBookingId}
                  className="shrink-0 rounded-full border border-[var(--linen)] bg-white px-3 py-2 font-[var(--font-jost)] text-xs text-[var(--forest-dark)]"
                >
                  {copied ? "已复制" : "复制"}
                </button>
              </div>

              <p className="mt-2 font-[var(--font-jost)] text-xs font-light text-[var(--sage)]">
                请在支付宝付款备注中填写该订单编号。
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-[var(--linen)] bg-white p-4">
                <p className="font-[var(--font-jost)] text-xs text-[var(--sage)]">
                  应付金额
                </p>
                <p className="mt-2 font-[var(--font-cormorant)] text-[28px] font-semibold text-[var(--forest-dark)]">
                  ฿{booking.total_price_thb.toLocaleString()}
                </p>
              </div>

              <div className="rounded-[22px] border border-[var(--linen)] bg-white p-4">
                <p className="font-[var(--font-jost)] text-xs text-[var(--sage)]">
                  折合人民币
                </p>
                <p className="mt-2 font-[var(--font-cormorant)] text-[28px] font-semibold text-[var(--forest-dark)]">
                  ¥{totalCny.toLocaleString()}
                </p>
                <p className="mt-1 font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
                  汇率：0.21
                </p>
              </div>
            </div>

            {booking.saved_amount_thb && booking.saved_amount_thb > 0 ? (
              <div className="mt-4 rounded-[22px] border border-[rgba(60,85,56,0.14)] bg-[rgba(60,85,56,0.06)] px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-[var(--font-jost)] text-xs uppercase tracking-[0.12em] text-[var(--sage)]">
                      长住优惠
                    </p>
                    <p className="mt-1 font-[var(--font-jost)] text-sm font-light text-[var(--forest-dark)]">
                      {booking.discount_label}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-[var(--font-jost)] text-xs text-[var(--sage)]">
                      已优惠
                    </p>
                    <p className="mt-1 font-[var(--font-cormorant)] text-[24px] font-semibold text-[var(--forest)]">
                      -฿{booking.saved_amount_thb.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex justify-between border-t border-[rgba(42,61,39,0.12)] pt-3 font-[var(--font-jost)] text-xs text-[var(--sage)]">
                  <span>原价</span>
                  <span>
                    ฿{(booking.original_total_thb ?? booking.total_price_thb).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="mt-6 rounded-[26px] border border-[var(--linen)] bg-white p-5 text-center">
              <h2 className="font-[var(--font-cormorant)] text-[28px] font-medium text-[var(--forest-dark)]">
                支付宝支付
              </h2>

              <p className="mt-2 font-[var(--font-jost)] text-sm font-light text-[var(--sage)]">
                使用支付宝扫一扫二维码完成支付
              </p>

              <div className="mx-auto mt-5 flex h-56 w-56 items-center justify-center overflow-hidden rounded-2xl border border-[var(--linen)] bg-[var(--cream)]">
                <img
                  src="/payment/alipay-qr.jpg"
                  alt="支付宝支付二维码"
                  className="h-full w-full object-contain p-3"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute pointer-events-none font-[var(--font-jost)] text-sm text-[var(--sage)]">
                  支付宝二维码
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] bg-[#f7efe1] px-4 py-4">
              <p className="font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--forest-dark)]">
                支付完成后，我们将尽快为您确认订单，并通过电子邮件发送确认信息。
                如已完成支付，请耐心等待我们的确认邮件。
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[var(--linen)] bg-[var(--card)] p-5">
            <p className="font-[var(--font-jost)] text-xs uppercase tracking-[0.16em] text-[var(--sage)]">
              Guest Info
            </p>

            <div className="mt-3 space-y-2 font-[var(--font-jost)] text-sm font-light text-[var(--forest-dark)]">
              <p>
                预订人：{booking.guest_last_name_pinyin}{" "}
                {booking.guest_first_name_pinyin}
              </p>
              <p>邮箱：{booking.guest_email}</p>
              {booking.wechat_id ? <p>微信号：{booking.wechat_id}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
