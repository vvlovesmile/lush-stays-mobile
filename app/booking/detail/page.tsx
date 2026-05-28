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
import { getListingBySlugFromSupabase } from "@/lib/listings";

export default function BookingDetailPage() {
  const [booking, setBooking] = useState<BookingRow | null>(null);
  const [listingMaxGuests, setListingMaxGuests] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    const timer = window.setTimeout(async () => {
      const currentBooking = getLookupBooking();
      setBooking(currentBooking);

      if (!currentBooking) return;

      try {
        const listing = await getListingBySlugFromSupabase(
          currentBooking.listing_slug
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

  const maxGuestCapacity = booking
    ? booking.num_rooms * (listingMaxGuests ?? booking.num_guests)
    : 0;

  if (!booking) {
    return (
      <main className="min-h-screen bg-white">
        <Header />

        <section className="bg-white px-5 py-14">
          <div className="mobile-container rounded-xl border border-[#d7d7d1] bg-white p-6 text-center soft-shadow">
            <h1 className="font-[var(--font-cormorant)] text-[26px] font-medium text-[var(--forest-dark)]">
              暂无预定详情
            </h1>

            <p className="mt-3 font-[var(--font-jost)] text-xs font-light leading-6 text-[var(--sage)]">
              请先输入邮箱地址和订单编号，查询对应的预定信息。
            </p>

            <Link
              href="/booking/lookup"
              className="mt-5 inline-flex rounded-lg bg-[var(--forest)] px-6 py-2.5 font-[var(--font-jost)] text-xs font-medium !text-white"
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
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-white px-5 pb-10 pt-5">
        <div className="mobile-container">
          <div className="mb-4 text-center">
            <p className="font-[var(--font-jost)] text-[10px] uppercase tracking-[0.16em] text-[var(--sage)]">
              Booking Detail
            </p>
            <h1 className="mt-1 font-[var(--font-cormorant)] text-[30px] font-medium text-[var(--forest-dark)]">
              预定详情
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <StatusCard
              label="支付状态"
              value={formatPaymentStatus(booking.payment_status)}
            />
            <StatusCard
              label="预定状态"
              value={formatBookingStatus(booking.booking_status)}
            />
          </div>

          <div className="mt-4 rounded-xl border border-[#d7d7d1] bg-white p-4 soft-shadow">
            <h2 className="font-[var(--font-cormorant)] text-[22px] font-medium text-[var(--forest-dark)]">
              订单信息
            </h2>

            <div className="mt-2 divide-y divide-[#e3e3dc]">
              <DetailRow label="订单编号" value={booking.booking_id} />
              <DetailRow label="房源名称" value={booking.listing_title} />
              <DetailRow label="入住日期" value={booking.checkin_date} />
              <DetailRow label="退房日期" value={booking.checkout_date} />
              <DetailRow label="几晚" value={`${booking.nights}晚`} />
              <DetailRow label="房间数量" value={`${booking.num_rooms}间`} />
              <DetailRow label="最多入住人数" value={`${maxGuestCapacity}人`} />
              <DetailRow
                label="总金额"
                value={`฿${booking.total_price_thb.toLocaleString()}`}
                highlight
              />
              <DetailRow
                label="支付方式"
                value={formatPaymentMethod(booking.payment_method)}
              />
              <DetailRow label="预定人邮箱" value={booking.guest_email} />

              {booking.wechat_id ? (
                <DetailRow label="微信号" value={booking.wechat_id} />
              ) : null}
            </div>
          </div>

          {booking.saved_amount_thb && booking.saved_amount_thb > 0 ? (
            <div className="mt-4 rounded-xl border border-[#d7d7d1] bg-white p-4 soft-shadow">
              <h2 className="font-[var(--font-cormorant)] text-[22px] font-medium text-[var(--forest-dark)]">
                优惠信息
              </h2>

              <div className="mt-2 divide-y divide-[#e3e3dc]">
                <DetailRow
                  label="原价"
                  value={`฿${(booking.original_total_thb ?? booking.total_price_thb).toLocaleString()}`}
                />
                <DetailRow
                  label="长住优惠"
                  value={booking.discount_label ?? "已应用优惠"}
                />
                <DetailRow
                  label="已优惠"
                  value={`-฿${booking.saved_amount_thb.toLocaleString()}`}
                  highlight
                />
              </div>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3 font-[var(--font-jost)] text-xs font-medium">
            <Link
              href="/"
              className="flex justify-center rounded-lg border border-[#d7d7d1] bg-white px-4 py-2.5 text-[var(--forest-dark)]"
            >
              返回首页
            </Link>

            <Link
              href="/booking/lookup"
              className="flex justify-center rounded-lg bg-[var(--forest)] px-4 py-2.5 !text-white"
            >
              重新查询
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

type StatusCardProps = {
  label: string;
  value: string;
};

function StatusCard({ label, value }: StatusCardProps) {
  return (
    <div className="rounded-xl border border-[#d7d7d1] bg-white px-3 py-2.5">
      <p className="font-[var(--font-jost)] text-[9px] text-[var(--sage)]">
        {label}
      </p>
      <p className="mt-1 font-[var(--font-jost)] text-xs font-medium text-[var(--forest-dark)]">
        {value}
      </p>
    </div>
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
