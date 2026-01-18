import { useState } from "react";
import { ScrollView } from "react-native";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box, VStack, HStack } from "@coinbase/cds-mobile/layout";
import { TextTitle1 } from "@coinbase/cds-mobile/typography/TextTitle1";
import { TextTitle3 } from "@coinbase/cds-mobile/typography/TextTitle3";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { TextLabel2 } from "@coinbase/cds-mobile/typography/TextLabel2";
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
import { Tag } from "@coinbase/cds-mobile/tag";
import { RelayProvider } from "@/components/RelayProvider";
import { TripMap } from "@/components/TripMap";
import { GpxUpload } from "@/components/GpxUpload";
import { PhotoUpload } from "@/components/PhotoUpload";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { SegmentList } from "@/components/SegmentList";
import { useAuth } from "@/lib/AuthContext";
import { MainStackParamList } from "@/navigation/types";
import type { TripScreenMobileQuery } from "./__generated__/TripScreenMobileQuery.graphql";
import type { Feature, LineString, MultiLineString } from "geojson";

type Props = NativeStackScreenProps<MainStackParamList, "Trip">;

function TripContent({
  username,
  tripSlug,
}: {
  username: string;
  tripSlug: string;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { user } = useAuth();
  const [fetchKey, setFetchKey] = useState(0);

  const data = useLazyLoadQuery<TripScreenMobileQuery>(graphql`
    query TripScreenMobileQuery($username: String!, $slug: String!) {
      profilesCollection(filter: { username: { eq: $username } }, first: 1) {
        edges {
          node {
            id
            username
            avatar_url
            tripsCollection(filter: { slug: { eq: $slug } }, first: 1) {
              edges {
                node {
                  id
                  name
                  slug
                  description
                  is_published
                  created_at
                  start_date
                  end_date
                  trips_summary_geometry_geojson
                  bounds_min_lat
                  bounds_min_lng
                  bounds_max_lat
                  bounds_max_lng
                  user_id
                  ...PhotoCarouselMobile_trip
                  ...SegmentListMobile_trip
                }
              }
            }
          }
        }
      }
    }
  `, { username, slug: tripSlug }, { fetchPolicy: "store-and-network", fetchKey });

  const profile = data.profilesCollection?.edges?.[0]?.node;
  const trip = profile?.tripsCollection?.edges?.[0]?.node;
  const isOwner = user?.id && trip?.user_id && user.id === trip.user_id;

  if (!profile) {
    return (
      <Box flexGrow={1} background="bg" justifyContent="center" alignItems="center">
        <TextBody>User not found</TextBody>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box flexGrow={1} background="bg" justifyContent="center" alignItems="center">
        <TextBody>Trip not found</TextBody>
      </Box>
    );
  }

  const geojson = (() => {
    if (!trip.trips_summary_geometry_geojson) return null;
    try {
      const parsed = JSON.parse(trip.trips_summary_geometry_geojson);
      if (parsed.type === "LineString" || parsed.type === "MultiLineString") {
        return { type: "Feature" as const, geometry: parsed, properties: {} };
      }
      if (parsed.type === "Feature" && parsed.geometry) {
        return parsed as Feature<LineString | MultiLineString>;
      }
      return null;
    } catch {
      return null;
    }
  })();

  const bounds =
    trip.bounds_min_lat &&
    trip.bounds_min_lng &&
    trip.bounds_max_lat &&
    trip.bounds_max_lng
      ? {
          minLat: trip.bounds_min_lat,
          minLng: trip.bounds_min_lng,
          maxLat: trip.bounds_max_lat,
          maxLng: trip.bounds_max_lng,
        }
      : undefined;

  return (
    <Box flexGrow={1} background="bg">
      {/* Header with back button */}
      <HStack padding={2} borderedBottom alignItems="center" gap={2}>
          <Pressable onPress={() => navigation.goBack()}>
            <TextBody>Back</TextBody>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Profile", { username })}>
            <TextBody color="fgMuted">{profile.username}</TextBody>
          </Pressable>
          <TextBody color="fgMuted">/</TextBody>
          <TextBody numberOfLines={1} style={{ flex: 1 }}>{trip.name}</TextBody>
        </HStack>

        <ScrollView>
          {/* Trip Header */}
          <VStack padding={3} gap={2} borderedBottom>
            <TextTitle1>{trip.name}</TextTitle1>
            {trip.description && (
              <TextBody color="fgMuted">{trip.description}</TextBody>
            )}
            <HStack gap={2} alignItems="center">
              {trip.start_date && (
                <TextLabel2 color="fgMuted">
                  {new Date(trip.start_date).toLocaleDateString()}
                  {trip.end_date &&
                    trip.end_date !== trip.start_date &&
                    ` - ${new Date(trip.end_date).toLocaleDateString()}`}
                </TextLabel2>
              )}
              {!trip.is_published && (
                <Tag colorScheme="yellow">Draft</Tag>
              )}
            </HStack>
            {isOwner && (
              <HStack gap={2}>
                <GpxUpload
                  tripId={trip.id}
                  onUploadComplete={() => setFetchKey((k) => k + 1)}
                />
                <PhotoUpload
                  tripId={trip.id}
                  onUploadComplete={() => setFetchKey((k) => k + 1)}
                />
              </HStack>
            )}
          </VStack>

          {/* Map */}
          {geojson && (
            <Box padding={3}>
              <Box borderRadius={300} overflow="hidden">
                <TripMap geojson={geojson} bounds={bounds} />
              </Box>
            </Box>
          )}

          {/* Segments (owner only) */}
          {isOwner && (
            <Box padding={3}>
              <SegmentList
                tripRef={trip}
                onSegmentsChange={() => setFetchKey((k) => k + 1)}
              />
            </Box>
          )}

          {/* Photos */}
          <PhotoCarousel tripRef={trip} />

          {/* Trip Details */}
          <VStack padding={3} gap={2}>
            <TextTitle3>Details</TextTitle3>
            {trip.created_at && (
              <Box padding={2} background="bgAlternate" borderRadius={200}>
                <TextLabel2 color="fgMuted">Created</TextLabel2>
                <TextBody>
                  {new Date(trip.created_at).toLocaleDateString()}
                </TextBody>
              </Box>
            )}
          </VStack>
      </ScrollView>
    </Box>
  );
}

export function TripScreen({ route }: Props) {
  const { username, tripSlug } = route.params;

  return (
    <RelayProvider>
      <TripContent username={username} tripSlug={tripSlug} />
    </RelayProvider>
  );
}
