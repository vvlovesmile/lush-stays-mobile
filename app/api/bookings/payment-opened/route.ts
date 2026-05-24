import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type PaymentOpenedRequest = {
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentOpenedRequest;
    const bookingId = body.bookingId?.trim().toUpperCase();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing booking id." },
        { status: 400 }
      );
    }

    const { data: booking, error: fetchError } = await supabaseServer
      .from("bookings")
      .select(bookingSelect)
      .eq("booking_id", bookingId)
      .single();

    if (fetchError || !booking) {
      console.error(fetchError);
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    if (
      booking.payment_status === "pending_review" ||
      booking.payment_status === "paid"
    ) {
      return NextResponse.json({ booking });
    }

    const { data: updatedBooking, error: updateError } = await supabaseServer
      .from("bookings")
      .update({
        payment_status: "pending_review",
      })
      .eq("id", booking.id)
      .select(bookingSelect)
      .single();

    if (updateError || !updatedBooking) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Failed to update payment status." },
        { status: 500 }
      );
    }

    const { error: eventError } = await supabaseServer
      .from("booking_events")
      .insert({
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
      console.error(eventError);
      return NextResponse.json(
        { error: "Payment status updated, but failed to create event." },
        { status: 500 }
      );
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}