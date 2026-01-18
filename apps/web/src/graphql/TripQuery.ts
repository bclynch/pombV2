// This file is read by relay-compiler to generate types
// Do not import at runtime - import from __generated__ instead

import { graphql } from "react-relay";

export const TripQuery = graphql`
  query TripQueryWebQuery($username: String!, $slug: String!) {
    profilesCollection(filter: { username: { eq: $username } }, first: 1) {
      edges {
        node {
          id
          username
          avatar_url
          tripsCollection(filter: { slug: { eq: $slug } }, first: 1) {
            edges {
              node {
                id
                name
                slug
                description
                is_published
                created_at
                start_date
                end_date
                trips_summary_geometry_geojson
                bounds_min_lat
                bounds_min_lng
                bounds_max_lat
                bounds_max_lng
                user_id
                ...PhotoCarousel_trip
                ...SegmentList_trip
              }
            }
          }
        }
      }
    }
  }
`;
