import { useLazyLoadQuery } from "react-relay";
import { View, Text, FlatList, StyleSheet } from "react-native";
// Query defined in ../graphql/queries.ts - run `npm run relay` after changes
import type { queriesTripsListQuery } from "../graphql/__generated__/queriesTripsListQuery.graphql";
import TripsListQueryNode from "../graphql/__generated__/queriesTripsListQuery.graphql";

export function TripsList() {
  const data = useLazyLoadQuery<queriesTripsListQuery>(TripsListQueryNode, { first: 10 });

  const trips = data.tripsCollection?.edges ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.node.id}
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
