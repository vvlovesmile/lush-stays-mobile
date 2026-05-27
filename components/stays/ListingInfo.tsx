import type { Listing } from "@/data/listings";

type ListingInfoProps = {
  listing: Listing;
};

function GuestIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3 text-[var(--sage-light)]" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M4 19c.8-3.2 2.7-5 5-5s4.2 1.8 5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M15.5 11.5c1.7.4 3 1.8 3.5 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <circle cx="16" cy="7.5" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3 text-[var(--sage-light)]" viewBox="0 0 24 24" fill="none">
      <path d="M4 7v11" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M4 13h16v5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M7 10h4v3H7z" stroke="currentColor" strokeWidth="2" />
      <path d="M11 10h6a3 3 0 0 1 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3 text-[var(--sage-light)]" viewBox="0 0 24 24" fill="none">
      <path d="M5 11h15v2a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V6a2 2 0 0 1 4 0" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export function ListingInfo({ listing }: ListingInfoProps) {
  return (
    <section className="bg-white px-2.5 pt-0">
      <div className="mx-auto w-full max-w-[460px] rounded-b-xl border-x border-b border-[#d7d7d1] bg-white px-4 py-2 shadow-[0_10px_24px_rgba(42,61,39,0.06)]">
        <div className="flex min-w-0 items-center gap-2">
          <p className="shrink-0 font-[var(--font-jost)] text-[8px] uppercase tracking-[0.08em] text-[var(--sage)]">
            {listing.locationLabel}
          </p>

          <h1 className="min-w-0 truncate font-[var(--font-cormorant)] text-xs font-medium leading-[1.15] text-[var(--forest-dark)]">
            {listing.title}
          </h1>
        </div>

        <div className="mt-1.5 grid grid-cols-3 justify-items-center font-[var(--font-jost)] text-[9px] font-light leading-3 text-[var(--sage)]">
          <span className="flex min-w-0 items-center justify-center gap-1 whitespace-nowrap">
            <GuestIcon />
            {listing.maxGuests}位旅人
          </span>
          <span className="flex min-w-0 items-center justify-center gap-1 whitespace-nowrap">
            <BedIcon />
            {listing.bed_label}
          </span>
          <span className="flex min-w-0 items-center justify-center gap-1 whitespace-nowrap">
            <BathIcon />
            {listing.bathroomLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
