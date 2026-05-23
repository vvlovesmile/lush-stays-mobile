"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  formatBookingStatus,
  formatPaymentMethod,
  formatPaymentStatus,
  getLookupBooking,
  type BookingRow,
} from "@/lib/bookings";

export default function BookingDetailPage() {
  const [booking, setBooking] = useState<BookingRow | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBooking(getLookupBooking());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!booking) {
    return (
      <main className="page-shell">
        <Header />

        <section className="px-5 py-14">
          <div className="mobile-container rounded-[28px] border border-[var(--linen)] bg-[var(--card)] p-6 text-center soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[32px] font-medium text-[var(--forest-dark)]">
              暂无预定详情
            </h1>

            <p className="mt-4 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              请先输入邮箱地址和订单编号，查询对应的预定信息。
            </p>

            <Link
              href="/booking/lookup"
              className="mt-6 inline-flex rounded-full bg-[var(--forest)] px-6 py-3 font-[var(--font-jost)] text-sm font-medium text-[var(--cream)]"
            >
              返回查询
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

      <section className="bg-[var(--forest)] px-5 py-5 text-center text-[var(--cream)]">
        <div className="mobile-container">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)]">
            ✓
          </div>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-[36px] font-medium">
            预定详情
          </h1>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mobile-container">
          <div className="rounded-[30px] border border-[var(--linen)] bg-[var(--card)] p-5 soft-shadow">
            <div className="flex gap-4">
              {booking.listing_cover_image ? (
                <img
                  src={booking.listing_cover_image}
                  alt={booking.listing_title}
                  className="h-28 w-32 rounded-2xl object-cover"
                />
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-jost)] text-xs uppercase tracking-[0.12em] text-[var(--sage)]">
                  {booking.location_label}
                </p>

                <h2 className="mt-2 font-[var(--font-cormorant)] text-[28px] font-medium leading-tight text-[var(--forest-dark)]">
                  {booking.listing_title}
                </h2>
              </div>
            </div>

            <div className="mt-6 divide-y divide-[var(--linen)]">
              <DetailRow label="订单编号" value={booking.booking_id} />
              <DetailRow label="入住" value={booking.checkin_date} />
              <DetailRow label="退房" value={booking.checkout_date} />
              <DetailRow label="几间房" value={`${booking.num_rooms}间`} />
              <DetailRow label="几人入住" value={`${booking.num_guests}人`} />
              <DetailRow label="预定人邮箱" value={booking.guest_email} />
              
              {booking.saved_amount_thb && booking.saved_amount_thb > 0 ? (
                <>
                  <DetailRow
                    label="原价"
                    value={`THB ${(booking.original_total_thb ?? booking.total_price_thb).toLocaleString()}`}
                  />
                  <DetailRow
                    label="长住优惠"
                    value={booking.discount_label ?? "已应用优惠"}
                  />
                  <DetailRow
                    label="已优惠"
                    value={`-THB ${booking.saved_amount_thb.toLocaleString()}`}
                  />
                </>
              ) : null}

              <DetailRow
                label="订单总价"
                value={`THB ${booking.total_price_thb.toLocaleString()}`}
                highlight
              />
              <DetailRow
                label="支付方式"
                value={formatPaymentMethod(booking.payment_method)}
              />
              <DetailRow
                label="支付状态"
                value={formatPaymentStatus(booking.payment_status)}
              />
              <DetailRow
                label="预定状态"
                value={formatBookingStatus(booking.booking_status)}
              />
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[var(--linen)] bg-[#f7efe1] px-5 py-4">
            <p className="font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--forest-dark)]">
              请妥善保留订单编号，以便后续客服服务。
            </p>
          </div>

          <div className="mt-7 flex justify-center gap-6 font-[var(--font-jost)] text-sm text-[var(--forest-dark)]">
            <Link href="/" className="underline underline-offset-4">
              返回首页
            </Link>

            <Link href="/booking/lookup" className="underline underline-offset-4">
              重新查询
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function DetailRow({ label, value, highlight = false }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 font-[var(--font-jost)]">
      <span className="text-sm font-light text-[var(--sage)]">{label}</span>

      <span
        className={`text-right text-sm ${
          highlight
            ? "font-semibold text-[var(--forest)]"
            : "font-normal text-[var(--forest-dark)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
