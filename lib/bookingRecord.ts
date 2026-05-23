import { getBookingDraft, type BookingDraft } from "@/lib/bookingDraft";
import { getBookingOrder, type BookingOrder } from "@/lib/order";

export type GuestInfo = {
  lastNamePinyin: string;
  firstNamePinyin: string;
  email: string;
  wechatId: string;
  note: string;
};

export type BookingRecord = {
  draft: BookingDraft;
  order: BookingOrder;
  guestInfo: GuestInfo;
  paymentMethod: "支付宝";
  paymentStatus: "待确认" | "已付款" | "已取消";
};

const GUEST_INFO_KEY = "lush_booking_guest_info";
const LOOKUP_RESULT_KEY = "lush_lookup_booking_result";

export function getGuestInfo(): GuestInfo | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(GUEST_INFO_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as GuestInfo;
  } catch {
    return null;
  }
}

export function getCurrentBookingRecord(): BookingRecord | null {
  const draft = getBookingDraft();
  const order = getBookingOrder();
  const guestInfo = getGuestInfo();

  if (!draft || !order || !guestInfo) return null;

  return {
    draft,
    order,
    guestInfo,
    paymentMethod: "支付宝",
    paymentStatus: "待确认",
  };
}

export function findBookingByEmailAndId(email: string, bookingId: string) {
  const record = getCurrentBookingRecord();

  if (!record) return null;

  const normalizedInputEmail = email.trim().toLowerCase();
  const normalizedSavedEmail = record.guestInfo.email.trim().toLowerCase();

  const normalizedInputBookingId = bookingId.trim().toUpperCase();
  const normalizedSavedBookingId = record.order.bookingId.trim().toUpperCase();

  if (
    normalizedInputEmail === normalizedSavedEmail &&
    normalizedInputBookingId === normalizedSavedBookingId
  ) {
    return record;
  }

  return null;
}

export function saveLookupResult(record: BookingRecord) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(LOOKUP_RESULT_KEY, JSON.stringify(record));
}

export function getLookupResult(): BookingRecord | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(LOOKUP_RESULT_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as BookingRecord;
  } catch {
    return null;
  }
}

export function clearLookupResult() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(LOOKUP_RESULT_KEY);
}