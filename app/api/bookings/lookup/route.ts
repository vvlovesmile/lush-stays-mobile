import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type LookupBookingRequest = {
  email: string;
  bookingId: string;
};

const bookingSelect = `
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
`;

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LookupBookingRequest;

    const normalizedEmail = body.email?.trim().toLowerCase();
    const normalizedBookingId = body.bookingId?.trim().toUpperCase();

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!normalizedBookingId) {
      return NextResponse.json(
        { error: "Missing booking id." },
        { status: 400 }
      );
    }

    const { data: booking, error } = await supabaseServer
      .from("bookings")
      .select(bookingSelect)
      .eq("guest_email", normalizedEmail)
      .eq("booking_id", normalizedBookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}