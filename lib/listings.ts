import { supabase } from "@/lib/supabaseClient";
import type { DiscountRule, Listing } from "@/data/listings";

type SupabaseListing = {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string | null;
  location_label: string;
  cover_image: string;
  gallery_images: string[] | null;
  price_per_night_thb: number;
  max_guests: number;
  bed_label: string;
  bathroom_label: string;
  short_description: string | null;
  description: string | null;
  overview: string[] | null;
  amenities: string[] | null;
  house_rules: string[] | null;
  discount_rules: DiscountRule[] | null;
};

function mapListing(row: SupabaseListing): Listing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    locationLabel: row.location_label,
    district: row.district ?? "",
    coverImage: row.cover_image,
    galleryImages: row.gallery_images ?? [],
    pricePerNightThb: row.price_per_night_thb,
    maxGuests: row.max_guests,
    bed_label: row.bed_label,
    bathroomLabel: row.bathroom_label,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    overview: row.overview ?? [],
    amenities: row.amenities ?? [],
    houseRules: row.house_rules ?? [],
    discountRules: row.discount_rules ?? [],
  };
}

export async function getActiveListings() {
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id,
      slug,
      title,
      city,
      district,
      location_label,
      cover_image,
      gallery_images,
      price_per_night_thb,
      max_guests,
      bed_label,
      bathroom_label,
      short_description,
      description,
      overview,
      amenities,
      house_rules,
      discount_rules
    `
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapListing);
}

export async function getListingBySlugFromSupabase(slug: string) {
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id,
      slug,
      title,
      city,
      district,
      location_label,
      cover_image,
      gallery_images,
      price_per_night_thb,
      max_guests,
      bed_label,
      bathroom_label,
      short_description,
      description,
      overview,
      amenities,
      house_rules,
      discount_rules
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    return null;
  }

  return mapListing(data);
}