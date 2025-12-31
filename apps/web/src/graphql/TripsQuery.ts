// This file is read by relay-compiler to generate types
// Do not import at runtime - import from __generated__ instead

import { graphql } from "react-relay";

export const TripsQuery = graphql`
  query TripsQueryQuery($first: Int!) {
    tripsCollection(first: $first) {
      edges {
        node {
          id
          name
          description
          is_published
          created_at
          trips_summary_geometry_geojson
          bounds_min_lat
          bounds_min_lng
          bounds_max_lat
          bounds_max_lng
        }
      }
    }
  }
`;
