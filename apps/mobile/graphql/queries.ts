// This file is only read by relay-compiler to generate types
// Do not import this at runtime - import from __generated__ instead

import { graphql } from "react-relay";

export const TripsListQuery = graphql`
  query queriesTripsListQuery($first: Int!) {
    tripsCollection(first: $first) {
      edges {
        node {
          id
          name
          description
          is_published
          created_at
        }
      }
    }
  }
`;
