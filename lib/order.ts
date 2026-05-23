export type BookingOrder = {
  bookingId: string;
  createdAt: string;
};

const BOOKING_ORDER_KEY = "lush_booking_order";

function createDatePart() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function createRandomPart() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

export function generateBookingId() {
  return `LS${createDatePart()}${createRandomPart()}`;
}

export function getOrCreateBookingOrder(): BookingOrder {
  if (typeof window === "undefined") {
    return {
      bookingId: "",
      createdAt: "",
    };
  }

  const existingOrder = window.sessionStorage.getItem(BOOKING_ORDER_KEY);

  if (existingOrder) {
    try {
      return JSON.parse(existingOrder) as BookingOrder;
    } catch {
      window.sessionStorage.removeItem(BOOKING_ORDER_KEY);
    }
  }

  const order: BookingOrder = {
    bookingId: generateBookingId(),
    createdAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(BOOKING_ORDER_KEY, JSON.stringify(order));

  return order;
}

export function getBookingOrder(): BookingOrder | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(BOOKING_ORDER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as BookingOrder;
  } catch {
    return null;
  }
}

export function clearBookingOrder() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(BOOKING_ORDER_KEY);
}

export function saveBookingOrder(order: BookingOrder) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(BOOKING_ORDER_KEY, JSON.stringify(order));
}
