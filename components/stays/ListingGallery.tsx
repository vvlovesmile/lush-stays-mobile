"use client";

import { useRef, useState } from "react";
import type { Listing } from "@/data/listings";

type ListingGalleryProps = {
  listing: Listing;
};

export function ListingGallery({ listing }: ListingGalleryProps) {
  const images =
    listing.galleryImages.length > 0
      ? listing.galleryImages
      : [listing.coverImage];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToImage = (index: number) => {
    const container = containerRef.current;

    if (!container) return;

    const safeIndex = Math.max(0, Math.min(index, images.length - 1));

    container.scrollTo({
      left: safeIndex * container.clientWidth,
      behavior: "smooth",
    });

    setCurrentIndex(safeIndex);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    const swipeThreshold = 40;

    if (distance > swipeThreshold) {
      scrollToImage(currentIndex + 1);
    }

    if (distance < -swipeThreshold) {
      scrollToImage(currentIndex - 1);
    }

    touchStartX.current = null;
  };

  return (
    <section className="pt-0">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex snap-x snap-mandatory overflow-x-hidden scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <div
            key={image}
            className="relative aspect-[5/4] min-w-full snap-center overflow-hidden bg-[var(--linen)]"
          >
            <img
              src={image}
              alt={`${listing.title} 图片 ${index + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
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