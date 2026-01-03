import { useCallback, useState } from "react";
import { useLazyLoadQuery, useRelayEnvironment, fetchQuery } from "react-relay";
import { TextTitle1, TextTitle3, TextBody } from "@coinbase/cds-web/typography";
import { Box, VStack } from "@coinbase/cds-web/layout";
import type { TripsQueryQuery } from "../graphql/__generated__/TripsQueryQuery.graphql";
import TripsQueryNode from "../graphql/__generated__/TripsQueryQuery.graphql";
import { TripMap } from "./TripMap";
import { GpxUpload } from "./GpxUpload";
import type { Feature, LineString, MultiLineString } from "geojson";

function parseGeometry(geojsonString: string | null | undefined): Feature<LineString | MultiLineString> | null {
  if (!geojsonString) return null;

  try {
    const parsed = JSON.parse(geojsonString);
    if (parsed.type === "LineString" || parsed.type === "MultiLineString") {
      return { type: "Feature", geometry: parsed, properties: {} };
    }
    if (parsed.type === "Feature" && parsed.geometry) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function TripsList() {
  const environment = useRelayEnvironment();
  const [, setRefreshedAt] = useState(Date.now());

  const handleUploadComplete = useCallback(() => {
    fetchQuery(environment, TripsQueryNode, { first: 10 }, { fetchPolicy: "network-only" })
      .toPromise()
      .then(() => setRefreshedAt(Date.now()));
  }, [environment]);

  const data = useLazyLoadQuery<TripsQueryQuery>(
    TripsQueryNode,
    { first: 10 },
    { fetchPolicy: "store-and-network" }
  );

  const trips = data.tripsCollection?.edges ?? [];

  return (
    <Box width="100%" maxWidth={800} style={{ marginLeft: "auto", marginRight: "auto" }}>
      <VStack gap={3}>
        <TextTitle1>My Trips</TextTitle1>

        {trips.length === 0 ? (
          <TextBody color="fgMuted">No trips yet</TextBody>
        ) : (
          <VStack gap={2}>
            {trips.map(({ node }) => {
              const geometry = parseGeometry(node.trips_summary_geometry_geojson);
              const bounds = node.bounds_min_lat != null ? {
                minLat: node.bounds_min_lat,
                minLng: node.bounds_min_lng!,
                maxLat: node.bounds_max_lat!,
                maxLng: node.bounds_max_lng!,
              } : undefined;

              return (
                <Box
                  key={node.id}
                  padding={2}
                  borderedBottom
                >
                  <VStack gap={1.5}>
                    <TextTitle3>{node.name}</TextTitle3>
                    {node.description && (
                      <TextBody color="fgMuted">
                        {node.description}
                      </TextBody>
                    )}
                    {geometry && (
                      <Box borderRadius={200} overflow="hidden">
                        <TripMap geojson={geometry} bounds={bounds} />
                      </Box>
                    )}
                    <GpxUpload tripId={node.id} onUploadComplete={handleUploadComplete} />
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
