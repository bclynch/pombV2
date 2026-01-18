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
          slug
          description
          is_published
          created_at
          trips_summary_geometry_geojson
          bounds_min_lat
          bounds_min_lng
          bounds_max_lat
          bounds_max_lng
          profiles {
            username
          }
        }
      }
    }
  }
`;

export const TripQuery = graphql`
  query queriesTripQuery($username: String!, $slug: String!) {
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
                ...PhotoCarouselMobile_trip
                ...SegmentListMobile_trip
              }
            }
          }
        }
      }
    }
  }
`;

export const HomeScreenProfileQuery = graphql`
  query queriesHomeScreenProfileQuery($userId: UUID!) {
    profilesCollection(filter: { id: { eq: $userId } }, first: 1) {
      edges {
        node {
          username
        }
      }
    }
  }
`;
