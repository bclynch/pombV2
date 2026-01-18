import { memo, useRef, useState, useEffect, useCallback } from "react";
import { FlatList, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from "react-native";
import { graphql, useFragment } from "react-relay";
import { Image } from "expo-image";
import { Box, HStack, VStack } from "@coinbase/cds-mobile/layout";
import { TextTitle3 } from "@coinbase/cds-mobile/typography/TextTitle3";
import { TextLabel2 } from "@coinbase/cds-mobile/typography/TextLabel2";
import type { PhotoCarouselMobile_trip$key, PhotoCarouselMobile_trip$data } from "./__generated__/PhotoCarouselMobile_trip.graphql";

const R2_PUBLIC_URL = process.env.EXPO_PUBLIC_R2_PUBLIC_URL || "";

type Photo = NonNullable<PhotoCarouselMobile_trip$data['photosCollection']>['edges'][number]['node'];

type PhotoCarouselProps = {
  tripRef: PhotoCarouselMobile_trip$key;
};

export const PhotoCarousel = memo(({ tripRef }: PhotoCarouselProps) => {
  const data = useFragment(graphql`
    fragment PhotoCarouselMobile_trip on trips {
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

  const { width } = useWindowDimensions();
  const height = width * 1.2;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCounter, setShowCounter] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setShowCounter(true);
    hideTimerRef.current = setTimeout(() => {
      setShowCounter(false);
    }, 10000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [resetHideTimer]);

  if (photos.length === 0) {
    return null;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== activeIndex && index >= 0 && index < photos.length) {
      setActiveIndex(index);
      resetHideTimer();
    }
  };

  const getItemLayout = (_: unknown, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderPhoto = ({ item }: { item: Photo }) => {
    const imageKey = item.r2_key_large || item.r2_key_thumb;
    if (!imageKey) return null;

    return (
      <Box width={width} height={height}>
        <Image
          source={{ uri: `${R2_PUBLIC_URL}/${imageKey}` }}
          style={{ width, height }}
          contentFit="cover"
          placeholder={item.blurhash ? { blurhash: item.blurhash } : undefined}
          transition={200}
        />
      </Box>
    );
  };

  return (
    <VStack gap={3}>
      <Box paddingX={3}>
        <TextTitle3>Photos</TextTitle3>
      </Box>
      <Box>
        <FlatList
          ref={flatListRef}
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          windowSize={3}
          maxToRenderPerBatch={2}
          initialNumToRender={1}
          removeClippedSubviews
        />
        {showCounter && photos.length > 1 && (
          <Box style={styles.counterContainer}>
            <TextLabel2 style={styles.counterText}>
              {activeIndex + 1}/{photos.length}
            </TextLabel2>
          </Box>
        )}
        {photos.length > 1 && (
          <HStack justifyContent="center" gap={1} padding={2}>
            {photos.map((photo, index) => (
              <Box
                key={photo.id}
                width={8}
                height={8}
                borderRadius={100}
                background={index === activeIndex ? "bgPrimary" : "bgTertiary"}
              />
            ))}
          </HStack>
        )}
      </Box>
    </VStack>
  );
});

const styles = StyleSheet.create({
  counterContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(50, 50, 50, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: {
    color: "rgba(255, 255, 255, 0.9)",
  },
});
