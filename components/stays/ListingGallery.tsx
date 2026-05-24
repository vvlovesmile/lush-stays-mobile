import type { Listing } from "@/data/listings";

type ListingGalleryProps = {
  listing: Listing;
};

export function ListingGallery({ listing }: ListingGalleryProps) {
  const images =
    listing.galleryImages.length > 0 ? listing.galleryImages : [listing.coverImage];

  return (
    <section className="pt-0">
      <div className="flex snap-x overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((image, index) => (
          <div
            key={image}
            className="relative aspect-[5/4] min-w-full snap-center overflow-hidden bg-[var(--linen)]"
          >
            <img
              src={image}
              alt={`${listing.title} 图片 ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1 font-[var(--font-jost)] text-xs text-white">
              {index + 1} / {images.length}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}