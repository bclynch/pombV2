import { useCallback, useState } from "react";
import { useLazyLoadQuery, useRelayEnvironment, fetchQuery } from "react-relay";
import type { TripsQueryQuery } from "../graphql/__generated__/TripsQueryQuery.graphql";
import TripsQueryNode from "../graphql/__generated__/TripsQueryQuery.graphql";
import { TripMap } from "./TripMap";
import { GpxUpload } from "./GpxUpload";
import type { Feature, LineString, MultiLineString } from "geojson";

// Parse GeoJSON geometry from ST_AsGeoJSON output
function parseGeometry(geojsonString: string | null | undefined): Feature<LineString | MultiLineString> | null {
  if (!geojsonString) return null;

  try {
    const parsed = JSON.parse(geojsonString);
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>My Trips</h1>

      {trips.length === 0 ? (
        <p>No trips yet</p>
      ) : (
        <div>
          {trips.map(({ node }) => {
            const geometry = parseGeometry(node.trips_summary_geometry_geojson);
            const bounds = node.bounds_min_lat != null ? {
              minLat: node.bounds_min_lat,
              minLng: node.bounds_min_lng!,
              maxLat: node.bounds_max_lat!,
              maxLng: node.bounds_max_lng!,
            } : undefined;

            return (
              <div
                key={node.id}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #eee",
                  marginBottom: "16px",
                }}
              >
                <h3 style={{ margin: "0 0 8px" }}>{node.name}</h3>
                {node.description && (
                  <p style={{ color: "#666", margin: "0 0 12px" }}>
                    {node.description}
                  </p>
                )}
                {geometry && (
                  <div style={{ marginBottom: "12px" }}>
                    <TripMap geojson={geometry} bounds={bounds} style={{ borderRadius: "8px" }} />
                  </div>
                )}
                <GpxUpload tripId={node.id} onUploadComplete={handleUploadComplete} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
