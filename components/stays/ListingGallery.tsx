import type { Listing } from "@/data/listings";

type ListingGalleryProps = {
  listing: Listing;
};

export function ListingGallery({ listing }: ListingGalleryProps) {
  return (
    <section>
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[var(--card)]">
          <img
            src={listing.coverImage}
            alt={listing.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {listing.galleryImages.slice(0, 3).map((image) => (
              <span
                key={image}
                className="h-1.5 w-1.5 rounded-full bg-white/75"
              />
            ))}
          </div>
      </div>
    </section>
  );
}
