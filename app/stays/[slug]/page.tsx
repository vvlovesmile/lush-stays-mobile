import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BookingCard } from "@/components/stays/BookingCard";
import { ListingGallery } from "@/components/stays/ListingGallery";
import { ListingInfo } from "@/components/stays/ListingInfo";
import {
  getActiveListings,
  getListingBySlugFromSupabase,
} from "@/lib/listings";

type StayDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const listings = await getActiveListings();

  return listings.map((listing) => ({
    slug: listing.slug,
  }));
}

export default async function StayDetailPage({ params }: StayDetailPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlugFromSupabase(slug);

  if (!listing) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Header />

      <ListingGallery listing={listing} />

      <ListingInfo listing={listing} />

      <BookingCard listing={listing} />

      <section className="px-5 pt-8">
        <div className="mobile-container space-y-7">
          <div>
            <h2 className="font-[var(--font-cormorant)] text-[30px] font-medium text-[var(--forest-dark)]">
              房源介绍
            </h2>
            <p className="mt-3 font-[var(--font-jost)] text-sm font-light leading-7 text-[var(--sage)]">
              {listing.description}
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-cormorant)] text-[30px] font-medium text-[var(--forest-dark)]">
              房源概况
            </h2>
            <div className="mt-3 grid gap-2">
              {listing.overview.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[var(--linen)] bg-[var(--card)] px-4 py-3 font-[var(--font-jost)] text-sm font-light text-[var(--forest-dark)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-[var(--font-cormorant)] text-[30px] font-medium text-[var(--forest-dark)]">
              配套设施
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.amenities.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--linen)] bg-[var(--card)] px-4 py-2 font-[var(--font-jost)] text-xs text-[var(--forest-dark)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-[var(--font-cormorant)] text-[30px] font-medium text-[var(--forest-dark)]">
              入住须知
            </h2>
            <div className="mt-3 space-y-2">
              {listing.houseRules.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[rgba(60,85,56,0.06)] px-4 py-3 font-[var(--font-jost)] text-sm font-light text-[var(--forest-dark)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}