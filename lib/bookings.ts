import { supabase } from "@/lib/supabaseClient";
import type { BookingDraft } from "@/lib/bookingDraft";
import { generateBookingId, saveBookingOrder } from "@/lib/order";

export type BookingGuestInfo = {
  lastNamePinyin: string;
  firstNamePinyin: string;
  email: string;
  wechatId: string;
  note: string;
};

const EXCHANGE_RATE_CNY = 0.21;

export async function createBookingFromDraft(
  draft: BookingDraft,
  guestInfo: BookingGuestInfo
) {
  const bookingId = generateBookingId();
  const totalPriceCny = Number((draft.totalPriceThb * EXCHANGE_RATE_CNY).toFixed(2));

  const bookingPayload = {
    booking_id: bookingId,

    listing_id: draft.listingId,
    listing_slug: draft.listingSlug,
    listing_title: draft.listingTitle,
    listing_cover_image: draft.coverImage,
    location_label: draft.locationLabel,

    guest_email: guestInfo.email.trim().toLowerCase(),
    guest_first_name_pinyin: guestInfo.firstNamePinyin.trim(),
    guest_last_name_pinyin: guestInfo.lastNamePinyin.trim(),
    wechat_id: guestInfo.wechatId.trim() || null,
    guest_note: guestInfo.note.trim() || null,

    checkin_date: draft.checkin,
    checkout_date: draft.checkout,
    nights: draft.nights,
    num_rooms: draft.rooms,
    num_guests: draft.guests,

    price_per_night_thb: draft.pricePerNightThb,

    original_total_thb: draft.originalTotalThb,
    discount_rate: draft.discountRate,
    discount_label: draft.discountLabel,
    saved_amount_thb: draft.savedAmountThb,

    total_price_thb: draft.totalPriceThb,

    exchange_rate_cny: EXCHANGE_RATE_CNY,
    total_price_cny: totalPriceCny,

    payment_method: "alipay_qr",
    payment_status: "pending_payment",
    booking_status: "pending_confirmation",
    payment_remark: bookingId,
  };

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert(bookingPayload)
    .select("id, booking_id, created_at")
    .single();

  if (bookingError) {
    throw new Error(bookingError.message);
  }

  const { error: eventError } = await supabase.from("booking_events").insert({
    booking_id: booking.booking_id,
    booking_uuid: booking.id,
    event_type: "booking_created",
    event_note: "Guest created booking from booking info page.",
    new_payment_status: "pending_payment",
    new_booking_status: "pending_confirmation",
    created_by: "guest",
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  saveBookingOrder({
    bookingId: booking.booking_id,
    createdAt: booking.created_at,
  });

  return booking;
}

export type BookingRow = {
  id: string;
  booking_id: string;

  listing_id: string | null;
  listing_slug: string;
  listing_title: string;
  listing_cover_image: string | null;
  location_label: string | null;

  guest_email: string;
  guest_first_name_pinyin: string;
  guest_last_name_pinyin: string;
  wechat_id: string | null;
  guest_note: string | null;

  checkin_date: string;
  checkout_date: string;
  nights: number;
  num_rooms: number;
  num_guests: number;

  price_per_night_thb: number;
  original_total_thb: number | null;
  discount_rate: number | null;
  discount_label: string | null;
  saved_amount_thb: number | null;
  total_price_thb: number;

  exchange_rate_cny: number | null;
  total_price_cny: number | null;

  payment_method: string;
  payment_status: string;
  booking_status: string;

  payment_remark: string | null;

  created_at: string;
  updated_at: string;
};

export async function getBookingByBookingId(bookingId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      booking_id,
      listing_id,
      listing_slug,
      listing_title,
      listing_cover_image,
      location_label,
      guest_email,
      guest_first_name_pinyin,
      guest_last_name_pinyin,
      wechat_id,
      guest_note,
      checkin_date,
      checkout_date,
      nights,
      num_rooms,
      num_guests,
      price_per_night_thb,
      original_total_thb,
      discount_rate,
      discount_label,
      saved_amount_thb,
      total_price_thb,
      exchange_rate_cny,
      total_price_cny,
      payment_method,
      payment_status,
      booking_status,
      payment_remark,
      created_at,
      updated_at
    `
    )
    .eq("booking_id", bookingId)
    .single();

  if (error) {
    return null;
  }

  return data as BookingRow;
}

export async function markBookingPaymentPendingReview(booking: BookingRow) {
  if (booking.payment_status === "pending_review") {
    return booking;
  }

  if (booking.payment_status === "paid") {
    return booking;
  }

  const { data: updatedBooking, error: updateError } = await supabase
    .from("bookings")
    .update({
      payment_status: "pending_review",
    })
    .eq("id", booking.id)
    .select(
      `
      id,
      booking_id,
      listing_id,
      listing_slug,
      listing_title,
      listing_cover_image,
      location_label,
      guest_email,
      guest_first_name_pinyin,
      guest_last_name_pinyin,
      wechat_id,
      guest_note,
      checkin_date,
      checkout_date,
      nights,
      num_rooms,
      num_guests,
      price_per_night_thb,
      original_total_thb,
      discount_rate,
      discount_label,
      saved_amount_thb,
      total_price_thb,
      exchange_rate_cny,
      total_price_cny,
      payment_method,
      payment_status,
      booking_status,
      payment_remark,
      created_at,
      updated_at
    `
    )
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: eventError } = await supabase.from("booking_events").insert({
    booking_id: booking.booking_id,
    booking_uuid: booking.id,
    event_type: "payment_page_opened",
    event_note: "Guest opened Alipay QR payment page.",
    old_payment_status: booking.payment_status,
    new_payment_status: "pending_review",
    old_booking_status: booking.booking_status,
    new_booking_status: booking.booking_status,
    created_by: "guest",
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  return updatedBooking as BookingRow;
}

const LOOKUP_BOOKING_KEY = "lush_lookup_booking";

export async function findBookingByEmailAndBookingId(
  email: string,
  bookingId: string
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedBookingId = bookingId.trim().toUpperCase();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      booking_id,
      listing_id,
      listing_slug,
      listing_title,
      listing_cover_image,
      location_label,
      guest_email,
      guest_first_name_pinyin,
      guest_last_name_pinyin,
      wechat_id,
      guest_note,
      checkin_date,
      checkout_date,
      nights,
      num_rooms,
      num_guests,
      price_per_night_thb,
      original_total_thb,
      discount_rate,
      discount_label,
      saved_amount_thb,
      total_price_thb,
      exchange_rate_cny,
      total_price_cny,
      payment_method,
      payment_status,
      booking_status,
      payment_remark,
      created_at,
      updated_at
    `
    )
    .eq("guest_email", normalizedEmail)
    .eq("booking_id", normalizedBookingId)
    .single();

  if (error) {
    return null;
  }

  return data as BookingRow;
}

export function saveLookupBooking(booking: BookingRow) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(LOOKUP_BOOKING_KEY, JSON.stringify(booking));
}

export function getLookupBooking(): BookingRow | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(LOOKUP_BOOKING_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as BookingRow;
  } catch {
    return null;
  }
}

export function clearLookupBooking() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(LOOKUP_BOOKING_KEY);
}

export function formatPaymentStatus(status: string) {
  const statusMap: Record<string, string> = {
    pending_payment: "待支付",
    pending_review: "系统确认中",
    paid: "已付款",
    failed: "支付失败",
    refunded: "已退款",
  };

  return statusMap[status] ?? status;
}

export function formatBookingStatus(status: string) {
  const statusMap: Record<string, string> = {
    pending_confirmation: "待房东确认",
    confirmed: "已确认",
    cancelled: "已取消",
    completed: "已完成",
  };

  return statusMap[status] ?? status;
}

export function formatPaymentMethod(method: string) {
  const methodMap: Record<string, string> = {
    alipay_qr: "支付宝",
  };

  return methodMap[method] ?? method;
}
