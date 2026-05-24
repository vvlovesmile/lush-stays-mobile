
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { StayCard } from "@/components/home/StayCard";
import { getActiveListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await getActiveListings();
  
  return (
    <main className="page-shell">
      <Header />

      <Hero />

      <section className="flex min-h-[25vw] items-center bg-white px-6 py-4 text-center">
        <div className="mobile-container">
          <h2 className="font-[var(--font-cormorant)] text-[21px] font-medium leading-[1.16] text-[var(--forest-dark)]">
            精选适合慢下来生活的空间
          </h2>

          <p className="mx-auto mt-2 max-w-[310px] font-[var(--font-jost)] text-xs font-light leading-5 text-[var(--sage)]">
            我们用心挑选清迈的独特住所，融合自然、设计与在地文化，让每一次停留，都成为一段值得回忆的生活片段。
          </p>
        </div>
      </section>

      <section className="bg-white px-5 pb-10 pt-0">
        <div className="mobile-container">
          <div className="flex flex-col gap-4">
            {listings.map((listing) => (
              <StayCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
