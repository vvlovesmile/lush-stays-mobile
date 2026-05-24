import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateBookingId } from "@/lib/order";

const EXCHANGE_RATE_CNY = 0.21;

type CreateBookingRequest = {
  draft: {
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
  guestInfo: {
    lastNamePinyin: string;
    firstNamePinyin: string;
    email: string;
    wechatId: string;
    note: string;
  };
};

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBookingRequest;
    const { draft, guestInfo } = body;

    if (!draft || !guestInfo) {
      return NextResponse.json(
        { error: "Missing booking draft or guest info." },
        { status: 400 }
      );
    }

    const normalizedEmail = guestInfo.email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!guestInfo.firstNamePinyin.trim() || !guestInfo.lastNamePinyin.trim()) {
      return NextResponse.json(
        { error: "Guest name is required." },
        { status: 400 }
      );
    }

    if (!draft.checkin || !draft.checkout || draft.nights <= 0) {
      return NextResponse.json(
        { error: "Invalid stay dates." },
        { status: 400 }
      );
    }

    if (draft.rooms <= 0 || draft.guests <= 0) {
      return NextResponse.json(
        { error: "Invalid rooms or guests." },
        { status: 400 }
      );
    }

    const bookingId = generateBookingId();
    const totalPriceCny = Number(
      (draft.totalPriceThb * EXCHANGE_RATE_CNY).toFixed(2)
    );

    const bookingPayload = {
      booking_id: bookingId,

      listing_id: draft.listingId,
      listing_slug: draft.listingSlug,
      listing_title: draft.listingTitle,
      listing_cover_image: draft.coverImage,
      location_label: draft.locationLabel,

      guest_email: normalizedEmail,
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

    const { data: booking, error: bookingError } = await supabaseServer
      .from("bookings")
      .insert(bookingPayload)
      .select("id, booking_id, created_at")
      .single();

    if (bookingError) {
      console.error(bookingError);
      return NextResponse.json(
        { error: "Failed to create booking." },
        { status: 500 }
      );
    }

    const { error: eventError } = await supabaseServer
      .from("booking_events")
      .insert({
        booking_id: booking.booking_id,
        booking_uuid: booking.id,
        event_type: "booking_created",
        event_note: "Guest created booking from booking info page.",
        new_payment_status: "pending_payment",
        new_booking_status: "pending_confirmation",
        created_by: "guest",
      });

    if (eventError) {
      console.error(eventError);
      return NextResponse.json(
        { error: "Booking created, but failed to create event." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bookingId: booking.booking_id,
      createdAt: booking.created_at,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}