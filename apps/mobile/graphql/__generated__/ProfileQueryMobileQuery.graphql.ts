/**
 * @generated SignedSource<<eb1fb5f057df6e3a84cb13ae14a216d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ProfileQueryMobileQuery$variables = {
  username: string;
};
export type ProfileQueryMobileQuery$data = {
  readonly profilesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly avatar_url: string | null | undefined;
        readonly bio: string | null | undefined;
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
export type ProfileQueryMobileQuery = {
  response: ProfileQueryMobileQuery$data;
  variables: ProfileQueryMobileQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "username"
  }
],
v1 = [
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
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatar_url",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bio",
  "storageKey": null
},
v6 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": [
    {
      "created_at": "DescNullsLast"
    }
  ]
},
v7 = [
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
          (v2/*: any*/),
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v8 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  },
  (v6/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProfileQueryMobileQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": "tripsCollection",
                    "args": [
                      (v6/*: any*/)
                    ],
                    "concreteType": "tripsConnection",
                    "kind": "LinkedField",
                    "name": "__Profile_tripsCollection_connection",
                    "plural": false,
                    "selections": (v7/*: any*/),
                    "storageKey": "__Profile_tripsCollection_connection(orderBy:[{\"created_at\":\"DescNullsLast\"}])"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProfileQueryMobileQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": (v8/*: any*/),
                    "concreteType": "tripsConnection",
                    "kind": "LinkedField",
                    "name": "tripsCollection",
                    "plural": false,
                    "selections": (v7/*: any*/),
                    "storageKey": "tripsCollection(first:50,orderBy:[{\"created_at\":\"DescNullsLast\"}])"
                  },
                  {
                    "alias": null,
                    "args": (v8/*: any*/),
                    "filters": [
                      "orderBy"
                    ],
                    "handle": "connection",
                    "key": "Profile_tripsCollection",
                    "kind": "LinkedHandle",
                    "name": "tripsCollection"
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
    "cacheID": "0041c6d7d4e1506c0135fec16eb95a5a",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": null
        }
      ]
    },
    "name": "ProfileQueryMobileQuery",
    "operationKind": "query",
    "text": "query ProfileQueryMobileQuery(\n  $username: String!\n) {\n  profilesCollection(filter: {username: {eq: $username}}, first: 1) {\n    edges {\n      node {\n        id\n        username\n        avatar_url\n        bio\n        tripsCollection(first: 50, orderBy: [{created_at: DescNullsLast}]) {\n          edges {\n            node {\n              id\n              name\n              slug\n              description\n              is_published\n              created_at\n              start_date\n              trips_summary_geometry_geojson\n              bounds_min_lat\n              bounds_min_lng\n              bounds_max_lat\n              bounds_max_lng\n              __typename\n            }\n            cursor\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c83315923b6a9be5dc898b57746c9efc";

export default node;
