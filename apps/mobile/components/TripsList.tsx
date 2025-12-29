import { useLazyLoadQuery } from "react-relay";
import { View, Text, FlatList, StyleSheet } from "react-native";
// Query defined in ../graphql/queries.ts - run `npm run relay` after changes
import type { queriesTripsListQuery } from "@/graphql/__generated__/queriesTripsListQuery.graphql";
import TripsListQueryNode from "@/graphql/__generated__/queriesTripsListQuery.graphql";
import { TripMap } from "./TripMap";
import type { Feature, LineString } from "geojson";

// Sample GeoJSON line for demonstration
const sampleGeoJSON: Feature<LineString> = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [-122.4194, 37.7749], // San Francisco
      [-122.4089, 37.7855],
      [-122.3984, 37.7923],
      [-122.3879, 37.7891],
    ],
  },
  properties: {},
};

export function TripsList() {
  const data = useLazyLoadQuery<queriesTripsListQuery>(TripsListQueryNode, { first: 10 });

  const trips = data.tripsCollection?.edges ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.node.id}
        ListHeaderComponent={
          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Sample Trip Map</Text>
            <TripMap geojson={sampleGeoJSON} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <Text style={styles.tripName}>{item.node.name}</Text>
            {item.node.description && (
              <Text style={styles.tripDescription}>{item.node.description}</Text>
            )}
          </View>
        )}
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
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
  },
});
