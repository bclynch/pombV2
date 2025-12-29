import { useLazyLoadQuery } from "react-relay";
import type { TripsQueryQuery } from "../graphql/__generated__/TripsQueryQuery.graphql";
import TripsQueryNode from "../graphql/__generated__/TripsQueryQuery.graphql";
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
  const data = useLazyLoadQuery<TripsQueryQuery>(TripsQueryNode, { first: 10 });

  const trips = data.tripsCollection?.edges ?? [];

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Trips</h1>

      <div style={{ marginBottom: "24px" }}>
        <h2>Sample Trip Map</h2>
        <TripMap geojson={sampleGeoJSON} style={{ borderRadius: "8px" }} />
      </div>

      {trips.length === 0 ? (
        <p>No trips yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {trips.map(({ node }) => (
            <li
              key={node.id}
              style={{
                padding: "16px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h3 style={{ margin: 0 }}>{node.name}</h3>
              {node.description && (
                <p style={{ color: "#666", margin: "4px 0 0" }}>
                  {node.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
