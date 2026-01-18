import { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { graphql, useLazyLoadQuery, useRelayEnvironment, fetchQuery } from "react-relay";
import { Box, VStack } from "@coinbase/cds-mobile/layout";
import { TextTitle3 } from "@coinbase/cds-mobile/typography/TextTitle3";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
import type { TripsListMobileQuery } from "./__generated__/TripsListMobileQuery.graphql";
import TripsListMobileQueryNode from "./__generated__/TripsListMobileQuery.graphql";
import { TripMap } from "./TripMap";
import { GpxUpload } from "./GpxUpload";
import { MainStackParamList } from "@/navigation/types";
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
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const environment = useRelayEnvironment();
  const [refreshedAt, setRefreshedAt] = useState(Date.now());

  const handleUploadComplete = useCallback(() => {
    fetchQuery(environment, TripsListMobileQueryNode, { first: 10 }, { fetchPolicy: "network-only" })
      .toPromise()
      .then(() => setRefreshedAt(Date.now()));
  }, [environment]);

  const data = useLazyLoadQuery<TripsListMobileQuery>(graphql`
    query TripsListMobileQuery($first: Int!) {
      tripsCollection(first: $first) {
        edges {
          node {
            id
            name
            slug
            description
            is_published
            created_at
            trips_summary_geometry_geojson
            bounds_min_lat
            bounds_min_lng
            bounds_max_lat
            bounds_max_lng
            profiles {
              username
            }
          }
        }
      }
    }
  `, { first: 10 }, { fetchPolicy: "store-and-network" });

  const trips = data.tripsCollection?.edges ?? [];

  return (
    <Box flexGrow={1}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item }) => {
          const geometry = parseGeometry(item.node.trips_summary_geometry_geojson);
          const bounds = item.node.bounds_min_lat != null ? {
            minLat: item.node.bounds_min_lat,
            minLng: item.node.bounds_min_lng!,
            maxLat: item.node.bounds_max_lat!,
            maxLng: item.node.bounds_max_lng!,
          } : undefined;

          const username = item.node.profiles?.username;
          const slug = item.node.slug;

          const handlePress = () => {
            if (username && slug) {
              navigation.navigate("Trip", { username, tripSlug: slug });
            }
          };

          return (
            <Pressable onPress={handlePress}>
              <Box padding={2} borderedBottom>
                <VStack gap={2}>
                  <TextTitle3>{item.node.name}</TextTitle3>
                  {item.node.description && (
                    <TextBody color="fgMuted">{item.node.description}</TextBody>
                  )}
                  {geometry && (
                    <Box borderRadius={200} overflow="hidden">
                      <TripMap geojson={geometry} bounds={bounds} />
                    </Box>
                  )}
                  <GpxUpload tripId={item.node.id} onUploadComplete={handleUploadComplete} />
                </VStack>
              </Box>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Box padding={3} alignItems="center">
            <TextBody color="fgMuted">No trips yet</TextBody>
          </Box>
        }
      />
    </Box>
  );
}
