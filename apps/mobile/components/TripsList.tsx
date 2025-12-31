import { useState, useCallback } from "react";
import { useLazyLoadQuery, useRelayEnvironment, fetchQuery } from "react-relay";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { queriesTripsListQuery } from "@/graphql/__generated__/queriesTripsListQuery.graphql";
import TripsListQueryNode from "@/graphql/__generated__/queriesTripsListQuery.graphql";
import { TripMap } from "./TripMap";
import { GpxUpload } from "./GpxUpload";
import type { Feature, LineString, MultiLineString } from "geojson";

// Parse GeoJSON geometry from ST_AsGeoJSON output
function parseGeometry(geojsonString: string | null | undefined): Feature<LineString | MultiLineString> | null {
  if (!geojsonString) return null;

  try {
    const parsed = JSON.parse(geojsonString);
    // ST_AsGeoJSON returns just the geometry, wrap it in a Feature
    if (parsed.type === "LineString" || parsed.type === "MultiLineString") {
      return { type: "Feature", geometry: parsed, properties: {} };
    }
    if (parsed.type === "Feature") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function TripsList() {
  const environment = useRelayEnvironment();
  const [refreshedAt, setRefreshedAt] = useState(Date.now());

  const handleUploadComplete = useCallback(() => {
    // Fetch fresh data from network and update store
    fetchQuery(environment, TripsListQueryNode, { first: 10 }, { fetchPolicy: "network-only" })
      .toPromise()
      .then(() => setRefreshedAt(Date.now()));
  }, [environment]);

  const data = useLazyLoadQuery<queriesTripsListQuery>(
    TripsListQueryNode,
    { first: 10 },
    { fetchPolicy: "store-and-network" }
  );

  const trips = data.tripsCollection?.edges ?? [];

  return (
    <View style={styles.container}>
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

          return (
            <View style={styles.tripCard}>
              <Text style={styles.tripName}>{item.node.name}</Text>
              {item.node.description && (
                <Text style={styles.tripDescription}>{item.node.description}</Text>
              )}
              {geometry && (
                <View style={styles.tripMapContainer}>
                  <TripMap geojson={geometry} bounds={bounds} />
                </View>
              )}
              <GpxUpload tripId={item.node.id} onUploadComplete={handleUploadComplete} />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No trips yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    padding: 16,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  tripCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tripName: {
    fontSize: 18,
    fontWeight: "600",
  },
  tripDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  tripMapContainer: {
    marginTop: 12,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
  },
});
