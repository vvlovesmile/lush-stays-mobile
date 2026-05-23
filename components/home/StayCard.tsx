import Link from "next/link";
import type { Listing } from "@/data/listings";

type StayCardProps = {
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

export function StayCard({ listing }: StayCardProps) {
  return (
    <article className="soft-shadow grid grid-cols-[47%_minmax(0,1fr)] overflow-hidden rounded-xl border border-[var(--linen)] bg-white">
      <div className="relative aspect-[5/4] w-full overflow-hidden">
        <img
          src={listing.coverImage}
          alt={listing.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded-md bg-white px-2 py-1 font-[var(--font-jost)] text-[9px] font-normal tracking-[0.04em] text-[var(--sage)] shadow-sm">
          {listing.locationLabel}
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-between px-2.5 py-2.5">
        <div>
          <h3 className="mt-1 font-[var(--font-cormorant)] text-xs font-medium leading-[1.15] text-[var(--forest-dark)]">
            {listing.title}
          </h3>
        </div>

        <div className="grid gap-1 font-[var(--font-jost)] text-[9px] font-light leading-3 text-[var(--sage)]">
          <span className="flex items-center gap-1">
            <GuestIcon />
            {listing.maxGuests}位旅人
          </span>
          <span className="flex items-center gap-1">
            <BedIcon />
            {listing.bed_label}
          </span>
          <span className="flex items-center gap-1">
            <BathIcon />
            {listing.bathroomLabel}
          </span>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-1.5 pr-1">
          <div className="flex h-7 items-center whitespace-nowrap font-[var(--font-cormorant)] text-sm font-medium text-[var(--forest-dark)]">
            ฿{listing.pricePerNightThb} / 晚 起
          </div>

          <Link
            href={`/stays/${listing.slug}`}
            className="inline-flex h-7 shrink-0 items-center rounded-md bg-[var(--forest)] px-2 font-[var(--font-jost)] text-[10px] font-medium tracking-[0.02em] !text-white"
          >
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
