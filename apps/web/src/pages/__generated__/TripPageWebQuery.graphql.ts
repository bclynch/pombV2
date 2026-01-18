/**
 * @generated SignedSource<<060eea58364d76bdeecd57d525f7df8f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TripPageWebQuery$variables = {
  slug: string;
  username: string;
};
export type TripPageWebQuery$data = {
  readonly profilesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly avatar_url: string | null | undefined;
        readonly id: any;
        readonly tripsCollection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly bounds_max_lat: number | null | undefined;
              readonly bounds_max_lng: number | null | undefined;
              readonly bounds_min_lat: number | null | undefined;
              readonly bounds_min_lng: number | null | undefined;
              readonly created_at: any | null | undefined;
              readonly description: string | null | undefined;
              readonly end_date: any | null | undefined;
              readonly id: any;
              readonly is_published: boolean | null | undefined;
              readonly name: string;
              readonly slug: string;
              readonly start_date: any | null | undefined;
              readonly trips_summary_geometry_geojson: string | null | undefined;
              readonly user_id: any;
              readonly " $fragmentSpreads": FragmentRefs<"PhotoCarousel_trip" | "SegmentList_trip">;
            };
          }>;
        } | null | undefined;
        readonly username: string | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type TripPageWebQuery = {
  response: TripPageWebQuery$data;
  variables: TripPageWebQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "username"
},
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v3 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "username"
          }
        ],
        "kind": "ObjectValue",
        "name": "username"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  },
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatar_url",
  "storageKey": null
},
v7 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "slug"
          }
        ],
        "kind": "ObjectValue",
        "name": "slug"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  },
  (v2/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_published",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "start_date",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "end_date",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trips_summary_geometry_geojson",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bounds_min_lat",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bounds_min_lng",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bounds_max_lat",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bounds_max_lng",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "user_id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TripPageWebQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "profilesConnection",
        "kind": "LinkedField",
        "name": "profilesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "profilesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "profiles",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": (v7/*: any*/),
                    "concreteType": "tripsConnection",
                    "kind": "LinkedField",
                    "name": "tripsCollection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "tripsEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "trips",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/),
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v15/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v20/*: any*/),
                              {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "PhotoCarousel_trip"
                              },
                              {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "SegmentList_trip"
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "TripPageWebQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "profilesConnection",
        "kind": "LinkedField",
        "name": "profilesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "profilesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "profiles",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": (v7/*: any*/),
                    "concreteType": "tripsConnection",
                    "kind": "LinkedField",
                    "name": "tripsCollection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "tripsEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "trips",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/),
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v15/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v20/*: any*/),
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "first",
                                    "value": 100
                                  },
                                  {
                                    "kind": "Literal",
                                    "name": "orderBy",
                                    "value": [
                                      {
                                        "captured_at": "AscNullsLast"
                                      }
                                    ]
                                  }
                                ],
                                "concreteType": "photosConnection",
                                "kind": "LinkedField",
                                "name": "photosCollection",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "photosEdge",
                                    "kind": "LinkedField",
                                    "name": "edges",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "photos",
                                        "kind": "LinkedField",
                                        "name": "node",
                                        "plural": false,
                                        "selections": [
                                          (v4/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "r2_key_thumb",
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "r2_key_large",
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "blurhash",
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "captured_at",
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "photosCollection(first:100,orderBy:[{\"captured_at\":\"AscNullsLast\"}])"
                              },
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "orderBy",
                                    "value": [
                                      {
                                        "sort_order": "AscNullsLast"
                                      }
                                    ]
                                  }
                                ],
                                "concreteType": "trip_segmentsConnection",
                                "kind": "LinkedField",
                                "name": "trip_segmentsCollection",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "trip_segmentsEdge",
                                    "kind": "LinkedField",
                                    "name": "edges",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "trip_segments",
                                        "kind": "LinkedField",
                                        "name": "node",
                                        "plural": false,
                                        "selections": [
                                          (v4/*: any*/),
                                          (v8/*: any*/),
                                          (v10/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "sort_order",
                                            "storageKey": null
                                          },
                                          (v12/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "trip_uploadsConnection",
                                            "kind": "LinkedField",
                                            "name": "trip_uploadsCollection",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "trip_uploadsEdge",
                                                "kind": "LinkedField",
                                                "name": "edges",
                                                "plural": true,
                                                "selections": [
                                                  {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "trip_uploads",
                                                    "kind": "LinkedField",
                                                    "name": "node",
                                                    "plural": false,
                                                    "selections": [
                                                      (v4/*: any*/),
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "filename",
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "storageKey": null
                                                  }
                                                ],
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "trip_segmentsCollection(orderBy:[{\"sort_order\":\"AscNullsLast\"}])"
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "38c9d5d56d6fa39ae0bf6189385258df",
    "id": null,
    "metadata": {},
    "name": "TripPageWebQuery",
    "operationKind": "query",
    "text": "query TripPageWebQuery(\n  $username: String!\n  $slug: String!\n) {\n  profilesCollection(filter: {username: {eq: $username}}, first: 1) {\n    edges {\n      node {\n        id\n        username\n        avatar_url\n        tripsCollection(filter: {slug: {eq: $slug}}, first: 1) {\n          edges {\n            node {\n              id\n              name\n              slug\n              description\n              is_published\n              created_at\n              start_date\n              end_date\n              trips_summary_geometry_geojson\n              bounds_min_lat\n              bounds_min_lng\n              bounds_max_lat\n              bounds_max_lng\n              user_id\n              ...PhotoCarousel_trip\n              ...SegmentList_trip\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PhotoCarousel_trip on trips {\n  photosCollection(first: 100, orderBy: [{captured_at: AscNullsLast}]) {\n    edges {\n      node {\n        id\n        r2_key_thumb\n        r2_key_large\n        blurhash\n        captured_at\n      }\n    }\n  }\n}\n\nfragment SegmentList_trip on trips {\n  id\n  trip_segmentsCollection(orderBy: [{sort_order: AscNullsLast}]) {\n    edges {\n      node {\n        id\n        name\n        description\n        sort_order\n        created_at\n        trip_uploadsCollection {\n          edges {\n            node {\n              id\n              filename\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "54535261eb6cf13b90709bd3ebf794a4";

export default node;
