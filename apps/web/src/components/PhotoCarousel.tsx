import { useState, useEffect, useRef } from "react";
import { graphql, useFragment } from "react-relay";
import { TextTitle3, TextLabel2 } from "@coinbase/cds-web/typography";
import { Box, VStack, HStack } from "@coinbase/cds-web/layout";
import type { PhotoCarousel_trip$key } from "./__generated__/PhotoCarousel_trip.graphql";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";

type PhotoCarouselProps = {
  tripRef: PhotoCarousel_trip$key;
};

const MAX_WIDTH = 468;
const ASPECT_RATIO = 1.2;

export function PhotoCarousel({ tripRef }: PhotoCarouselProps) {
  const data = useFragment(graphql`
    fragment PhotoCarousel_trip on trips {
      photosCollection(first: 100, orderBy: [{ captured_at: AscNullsLast }]) {
        edges {
          node {
            id
            r2_key_thumb
            r2_key_large
            blurhash
            captured_at
          }
        }
      }
    }
  `, tripRef);
  const photos = data.photosCollection?.edges?.map((e) => e.node) ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [showCounter, setShowCounter] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const resetHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setShowCounter(true);
    hideTimerRef.current = setTimeout(() => {
      setShowCounter(false);
    }, 10000);
  };

  useEffect(() => {
    // Start the hide timer on mount
    hideTimerRef.current = setTimeout(() => {
      setShowCounter(false);
    }, 10000);
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (photos.length === 0) {
    return null;
  }

  const goToPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      resetHideTimer();
    }
  };

  const goToNext = () => {
    if (activeIndex < photos.length - 1) {
      setActiveIndex(activeIndex + 1);
      resetHideTimer();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50;

    if (diff > threshold && activeIndex < photos.length - 1) {
      setActiveIndex(activeIndex + 1);
      resetHideTimer();
    } else if (diff < -threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      resetHideTimer();
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  const currentPhoto = photos[activeIndex];
  const imageKey = currentPhoto?.r2_key_large || currentPhoto?.r2_key_thumb;

  return (
    <VStack gap={3}>
      <TextTitle3>Photos</TextTitle3>
      <VStack
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        gap={0}
      >
        {/* Image container with arrows */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: isMobile ? "100%" : MAX_WIDTH,
            aspectRatio: `1 / ${ASPECT_RATIO}`,
            touchAction: "pan-y pinch-zoom",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {imageKey && (
            <Box
              borderRadius={isMobile ? 0 : 300}
              overflow="hidden"
              width="100%"
              height="100%"
            >
              <img
                src={`${R2_PUBLIC_URL}/${imageKey}`}
                alt={`Photo ${activeIndex + 1} of ${photos.length}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          )}

          {/* Counter */}
          {showCounter && photos.length > 1 && (
            <Box
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(50, 50, 50, 0.7)",
                borderRadius: 12,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <TextLabel2 style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                {activeIndex + 1}/{photos.length}
              </TextLabel2>
            </Box>
          )}

          {/* Arrow buttons */}
          {photos.length > 1 && (
            <>
              {activeIndex > 0 && (
                <Box
                  as="button"
                  onClick={goToPrev}
                  aria-label="Previous photo"
                  width={36}
                  height={36}
                  borderRadius={500}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "rgba(50, 50, 50, 0.7)",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: 20,
                  }}
                >
                  &#8249;
                </Box>
              )}
              {activeIndex < photos.length - 1 && (
                <Box
                  as="button"
                  onClick={goToNext}
                  aria-label="Next photo"
                  width={36}
                  height={36}
                  borderRadius={500}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "rgba(50, 50, 50, 0.7)",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: 20,
                  }}
                >
                  &#8250;
                </Box>
              )}
            </>
          )}
        </div>

        {/* Dots indicator */}
        {photos.length > 1 && (
          <HStack justifyContent="center" gap={1} paddingY={2}>
            {photos.map((photo, index) => (
              <Box
                key={photo.id}
                as="button"
                onClick={() => {
                  setActiveIndex(index);
                  resetHideTimer();
                }}
                aria-label={`Go to photo ${index + 1}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  backgroundColor: index === activeIndex ? "#0052FF" : "#D1D5DB",
                }}
              />
            ))}
          </HStack>
        )}
      </VStack>
    </VStack>
  );
}
