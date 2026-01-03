/**
 * @generated SignedSource<<b4ce777abdcb79b5c85dc85537fe1715>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TripQueryWebQuery$variables = {
  slug: string;
  username: string;
};
export type TripQueryWebQuery$data = {
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
            };
          }>;
        } | null | undefined;
        readonly username: string | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type TripQueryWebQuery = {
  response: TripQueryWebQuery$data;
  variables: TripQueryWebQuery$variables;
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
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
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "username",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatar_url",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
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
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "slug",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "description",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "is_published",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "created_at",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "start_date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "end_date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "trips_summary_geometry_geojson",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "bounds_min_lat",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "bounds_min_lng",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "bounds_max_lat",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "bounds_max_lng",
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TripQueryWebQuery",
    "selections": (v4/*: any*/),
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
    "name": "TripQueryWebQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "b57b5b975456c9bbed344b9a6bb0b69b",
    "id": null,
    "metadata": {},
    "name": "TripQueryWebQuery",
    "operationKind": "query",
    "text": "query TripQueryWebQuery(\n  $username: String!\n  $slug: String!\n) {\n  profilesCollection(filter: {username: {eq: $username}}, first: 1) {\n    edges {\n      node {\n        id\n        username\n        avatar_url\n        tripsCollection(filter: {slug: {eq: $slug}}, first: 1) {\n          edges {\n            node {\n              id\n              name\n              slug\n              description\n              is_published\n              created_at\n              start_date\n              end_date\n              trips_summary_geometry_geojson\n              bounds_min_lat\n              bounds_min_lng\n              bounds_max_lat\n              bounds_max_lng\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e2a28f6797e0495a39b6d6eed4fd1338";

export default node;
