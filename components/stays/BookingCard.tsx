"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Listing } from "@/data/listings";
import { saveBookingDraft } from "@/lib/bookingDraft";
import { clearLookupResult } from "@/lib/bookingRecord";
import { clearBookingOrder } from "@/lib/order";
import { calculateBookingPrice } from "@/lib/pricing";

type BookingCardProps = {
  listing: Listing;
};

type ActiveDateField = "checkin" | "checkout" | null;

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateDisplay(date: string) {
  if (!date) {
    return "2026-05-22";
  }

  const currentDate = new Date(`${date}T00:00:00`);

  return `${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;
}

function calculateNights(checkin: string, checkout: string) {
  if (!checkin || !checkout) {
    return 0;
  }

  const checkinDate = new Date(`${checkin}T00:00:00`);
  const checkoutDate = new Date(`${checkout}T00:00:00`);

  const diffTime = checkoutDate.getTime() - checkinDate.getTime();
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return nights > 0 ? nights : 0;
}

function getNextDateString(date: string) {
  if (!date) {
    return "";
  }

  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);

  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, "0");
  const day = String(nextDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getMonthTitle(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blankDays = Array.from<null>({ length: firstDay.getDay() }).fill(null);
  const dateDays = Array.from({ length: daysInMonth }).map((_, index) =>
    getDateString(new Date(year, month, index + 1))
  );

  return [...blankDays, ...dateDays];
}

export function BookingCard({ listing }: BookingCardProps) {
  const router = useRouter();
  const today = getTodayString();
  const firstCalendarMonth = new Date(`${today.slice(0, 7)}-01T00:00:00`);

  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [activeDateField, setActiveDateField] =
    useState<ActiveDateField>(null);
  const [calendarMonth, setCalendarMonth] = useState(firstCalendarMonth);

  const nights = useMemo(() => {
    return calculateNights(checkin, checkout);
  }, [checkin, checkout]);

  const pricing = useMemo(() => {
    return calculateBookingPrice({
      pricePerNightThb: listing.pricePerNightThb,
      nights,
      rooms,
      discountRules: listing.discountRules,
    });
  }, [nights, rooms, listing.pricePerNightThb, listing.discountRules]);

  const totalPrice = pricing.finalTotal;

  const discountedPricePerNight = Math.round(
    listing.pricePerNightThb * pricing.discountRate
  );

  const handleReserve = () => {
    if (!checkin || !checkout || nights <= 0 || totalPrice <= 0) {
      alert("请先选择入住日期和退房日期");
      return;
    }

    clearBookingOrder();
    clearLookupResult();

    saveBookingDraft({
      listingId: listing.id,
      listingSlug: listing.slug,
      listingTitle: listing.title,
      locationLabel: listing.locationLabel,
      coverImage: listing.coverImage,
      pricePerNightThb: listing.pricePerNightThb,
      rooms,
      guests,
      checkin,
      checkout,
      nights,
      totalPriceThb: totalPrice,

      originalTotalThb: pricing.originalTotal,
      discountRate: pricing.discountRate,
      discountLabel: pricing.discountLabel,
      savedAmountThb: pricing.savedAmount,
    });

    router.push("/booking/verify");
  };

  const calendarDays = useMemo(() => {
    return getCalendarDays(calendarMonth);
  }, [calendarMonth]);

  const checkoutMinDate = getNextDateString(checkin) || today;
  const canGoPrevious = calendarMonth > firstCalendarMonth;

  const handleDateSelect = (date: string) => {
    if (activeDateField === "checkin") {
      setCheckin(date);

      if (checkout && date >= checkout) {
        setCheckout("");
      }

      const nextDate = getNextDateString(date);
      setActiveDateField("checkout");
      setCalendarMonth(new Date(`${nextDate.slice(0, 7)}-01T00:00:00`));
      return;
    }

    if (activeDateField === "checkout") {
      setCheckout(date);
      setActiveDateField(null);
    }
  };

  const isDateDisabled = (date: string) => {
    const minDate = activeDateField === "checkout" ? checkoutMinDate : today;

    return date < minDate;
  };

  return (
    <section className="bg-white px-2.5 pt-6">
      <div className="mx-auto w-full max-w-[460px] rounded-xl border border-[var(--linen)] bg-white px-3 py-4 soft-shadow">
        <div className="grid grid-cols-[0.8fr_0.72fr_1.12fr_1.12fr] gap-1.5">
          <label className="block">
            <span className="mb-1.5 block whitespace-nowrap font-[var(--font-jost)] text-[10px] font-medium text-[var(--sage)]">
              几人入住
            </span>

            <select
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="h-10 w-full rounded-lg border border-[var(--linen)] bg-white px-2 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none"
            >
              {Array.from({ length: listing.maxGuests }).map((_, index) => {
                const guestCount = index + 1;

                return (
                  <option key={guestCount} value={guestCount}>
                    {guestCount}人
                  </option>
                );
              })}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block whitespace-nowrap font-[var(--font-jost)] text-[10px] font-medium text-[var(--sage)]">
              几间房
            </span>

            <select
              value={rooms}
              onChange={(event) => setRooms(Number(event.target.value))}
              className="h-10 w-full rounded-lg border border-[var(--linen)] bg-white px-2 font-[var(--font-jost)] text-sm text-[var(--forest-dark)] outline-none"
            >
              <option value={1}>1间</option>
              <option value={2}>2间</option>
              <option value={3}>3间</option>
            </select>
          </label>

          <div className="block">
            <span className="mb-1.5 block whitespace-nowrap font-[var(--font-jost)] text-[10px] font-medium text-[var(--sage)]">
              入住日期
            </span>

            <button
              type="button"
              onClick={() => setActiveDateField("checkin")}
              className="h-10 w-full truncate rounded-lg border border-[var(--linen)] bg-white px-2 text-left font-[var(--font-jost)] text-xs text-[var(--forest-dark)] outline-none"
            >
              {formatDateDisplay(checkin)}
            </button>
          </div>

          <div className="block">
            <span className="mb-1.5 block whitespace-nowrap font-[var(--font-jost)] text-[10px] font-medium text-[var(--sage)]">
              退房日期
            </span>

            <button
              type="button"
              onClick={() => {
                setActiveDateField("checkout");
                if (checkin) {
                  setCalendarMonth(
                    new Date(`${checkoutMinDate.slice(0, 7)}-01T00:00:00`)
                  );
                }
              }}
              className="h-10 w-full truncate rounded-lg border border-[var(--linen)] bg-white px-2 text-left font-[var(--font-jost)] text-xs text-[var(--forest-dark)] outline-none"
            >
              {formatDateDisplay(checkout)}
            </button>
          </div>
        </div>

        {activeDateField ? (
          <div className="mt-4 rounded-xl border border-[var(--linen)] bg-white p-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}
                className="h-8 w-8 rounded-lg text-[var(--forest-dark)] disabled:text-[var(--sage-light)]"
                aria-label="上个月"
              >
                ‹
              </button>

              <div className="font-[var(--font-jost)] text-sm font-medium text-[var(--forest-dark)]">
                {activeDateField === "checkin" ? "选择入住日期" : "选择退房日期"}
                <span className="ml-2 text-[var(--sage)]">
                  {getMonthTitle(calendarMonth)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                className="h-8 w-8 rounded-lg text-[var(--forest-dark)]"
                aria-label="下个月"
              >
                ›
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center font-[var(--font-jost)] text-[11px] text-[var(--sage)]">
              {weekDays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`blank-${index}`} className="h-9" />;
                }

                const isSelected = date === checkin || date === checkout;
                const disabled = isDateDisabled(date);
                const day = Number(date.slice(-2));

                return (
                  <button
                    key={date}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDateSelect(date)}
                    className={`h-9 rounded-lg font-[var(--font-jost)] text-sm ${
                      isSelected
                        ? "bg-[var(--forest)] text-white"
                        : "bg-transparent text-[var(--forest-dark)]"
                    } disabled:text-[var(--sage-light)]`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-3 rounded-xl bg-[rgba(60,85,56,0.06)] px-3 py-4">
          <div>
            <p className="font-[var(--font-jost)] text-xs font-medium text-[var(--sage)]">
              每晚价格
            </p>
            <p className="mt-3 font-[var(--font-cormorant)] text-[26px] font-semibold text-[var(--forest-dark)]">
              ฿{discountedPricePerNight.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="font-[var(--font-jost)] text-xs font-medium text-[var(--sage)]">
              晚数
            </p>
            <p className="mt-3 font-[var(--font-cormorant)] text-[26px] font-semibold text-[var(--forest-dark)]">
              {nights > 0 ? `${nights}晚` : "—"}
            </p>
          </div>

          <div>
            <p className="font-[var(--font-jost)] text-xs font-medium text-[var(--sage)]">
              总价格
            </p>
            <p className="mt-3 font-[var(--font-cormorant)] text-[26px] font-semibold text-[var(--forest-dark)]">
              {totalPrice > 0 ? `฿${totalPrice.toLocaleString()}` : "—"}
            </p>
          </div>
        </div>

       <button
          type="button"
          onClick={handleReserve}
          className="mt-5 w-full rounded-2xl bg-[var(--forest)] px-6 py-4 font-[var(--font-jost)] text-lg font-medium tracking-[0.08em] text-[var(--cream)]"
        >
          立即预定
        </button>

        <p className="mt-4 text-center font-[var(--font-jost)] text-sm font-light leading-6 text-[var(--sage)]">
          安全支付 · 房东确认 · 入住前14天可免费取消
        </p>
      </div>
    </section>
  );
}
