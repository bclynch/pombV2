// This file is read by relay-compiler to generate types
// Do not import at runtime - import from __generated__ instead

import { graphql } from "react-relay";

export const ProfileQuery = graphql`
  query ProfileQueryMobileQuery($username: String!) {
    profilesCollection(filter: { username: { eq: $username } }, first: 1) {
      edges {
        node {
          id
          username
          avatar_url
          bio
          tripsCollection(first: 50, orderBy: [{ created_at: DescNullsLast }])
            @connection(key: "Profile_tripsCollection") {
            edges {
              node {
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
        }
      }
    }
  }
`;
