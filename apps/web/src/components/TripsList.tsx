import { useLazyLoadQuery } from "react-relay";
import type { TripsQueryQuery } from "../graphql/__generated__/TripsQueryQuery.graphql";
import TripsQueryNode from "../graphql/__generated__/TripsQueryQuery.graphql";

export function TripsList() {
  const data = useLazyLoadQuery<TripsQueryQuery>(TripsQueryNode, { first: 10 });

  const trips = data.tripsCollection?.edges ?? [];

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Trips</h1>
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
