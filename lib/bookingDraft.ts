export type BookingDraft = {
  listingId: string;
  listingSlug: string;
  listingTitle: string;
  locationLabel: string;
  coverImage: string;
  pricePerNightThb: number;
  rooms: number;
  guests: number;
  checkin: string;
  checkout: string;
  nights: number;
  totalPriceThb: number;
  
  originalTotalThb: number;
  discountRate: number;
  discountLabel: string;
  savedAmountThb: number;
};

const BOOKING_DRAFT_KEY = "lush_booking_draft";

export function saveBookingDraft(draft: BookingDraft) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
}

export function getBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(BOOKING_DRAFT_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as BookingDraft;
  } catch {
    return null;
  }
}

export function clearBookingDraft() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(BOOKING_DRAFT_KEY);
}