// This file is only read by relay-compiler to generate types
// Do not import this at runtime - import from __generated__ instead

import { graphql } from "react-relay";

export const CreateTripMutation = graphql`
  mutation mutationsCreateTripMutation($input: [tripsInsertInput!]!) {
    insertIntotripsCollection(objects: $input) {
      affectedCount
      records {
        id
        name
        description
        is_published
        created_at
        start_date
        trips_summary_geometry_geojson
        bounds_min_lat
        bounds_min_lng
        bounds_max_lat
        bounds_max_lng
      }
    }
  }
`;
