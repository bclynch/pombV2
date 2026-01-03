import { useParams } from "react-router-dom";
import { useLazyLoadQuery } from "react-relay";
import { TextTitle1, TextTitle3, TextBody, TextLabel2, Link } from "@coinbase/cds-web/typography";
import { Box, HStack, VStack, Grid } from "@coinbase/cds-web/layout";
import { Tag } from "@coinbase/cds-web/tag";
import { RelayProvider } from "../components/RelayProvider";
import { TripMap } from "../components/TripMap";
import type { TripQueryWebQuery } from "../graphql/__generated__/TripQueryWebQuery.graphql";
import TripQueryNode from "../graphql/__generated__/TripQueryWebQuery.graphql";
import type { Feature, LineString, MultiLineString } from "geojson";

function TripContent({
  username,
  tripSlug,
}: {
  username: string;
  tripSlug: string;
}) {
  const data = useLazyLoadQuery<TripQueryWebQuery>(
    TripQueryNode,
    { username, slug: tripSlug },
    { fetchPolicy: "store-and-network" }
  );

  const profile = data.profilesCollection?.edges?.[0]?.node;
  const trip = profile?.tripsCollection?.edges?.[0]?.node;

  if (!profile) {
    return (
      <Box minHeight="100vh" background="bg" padding={6}>
        <TextBody>User not found</TextBody>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box minHeight="100vh" background="bg" padding={6}>
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
    <VStack minHeight="100vh" background="bg" gap={0} width="100%">
      {/* Breadcrumb */}
      <Box as="nav" paddingY={2} paddingX={3} borderedBottom width="100%">
        <HStack gap={1} alignItems="center">
          <Link href={`/${username}`}>{profile.username}</Link>
          <TextBody color="fgMuted">/</TextBody>
          <TextBody>{trip.name}</TextBody>
        </HStack>
      </Box>

      {/* Trip Header */}
      <Box
        as="header"
        paddingY={4}
        paddingX={3}
        borderedBottom
        width="100%"
      >
        <Box maxWidth={1200} style={{ marginLeft: "auto", marginRight: "auto" }}>
          <VStack gap={2}>
            <TextTitle1>{trip.name}</TextTitle1>
            {trip.description && (
              <TextBody color="fgMuted" maxWidth={600}>
                {trip.description}
              </TextBody>
            )}
            <HStack gap={4} alignItems="center">
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
          </VStack>
        </Box>
      </Box>

      {/* Map */}
      {geojson && (
        <Box as="section" padding={3} width="100%">
          <Box maxWidth={1200} width="100%" style={{ marginLeft: "auto", marginRight: "auto" }}>
            <Box borderRadius={300} overflow="hidden" width="100%">
              <TripMap geojson={geojson} bounds={bounds} style={{ height: 500 }} />
            </Box>
          </Box>
        </Box>
      )}

      {/* Trip Details */}
      <Box as="section" padding={3} width="100%">
        <Box maxWidth={1200} width="100%" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <VStack gap={2}>
            <TextTitle3>Details</TextTitle3>
            <Grid columnMin={200} gap={2}>
              {trip.created_at && (
                <Box padding={2} background="bgAlternate" borderRadius={200}>
                  <TextLabel2 color="fgMuted">Created</TextLabel2>
                  <TextBody>
                    {new Date(trip.created_at).toLocaleDateString()}
                  </TextBody>
                </Box>
              )}
            </Grid>
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
}

export function TripPage() {
  const { username, tripSlug } = useParams<{
    username: string;
    tripSlug: string;
  }>();

  if (!username || !tripSlug) {
    return (
      <Box minHeight="100vh" background="bg" padding={6}>
        <TextBody>Invalid trip URL</TextBody>
      </Box>
    );
  }

  return (
    <RelayProvider>
      <TripContent username={username} tripSlug={tripSlug} />
    </RelayProvider>
  );
}
