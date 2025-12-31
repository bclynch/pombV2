/**
 * @generated SignedSource<<e848876109f18505ef98c10b633871d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type queriesTripsListQuery$variables = {
  first: number;
};
export type queriesTripsListQuery$data = {
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
        readonly trips_summary_geometry_geojson: string | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type queriesTripsListQuery = {
  response: queriesTripsListQuery$data;
  variables: queriesTripsListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "first",
        "variableName": "first"
      }
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "queriesTripsListQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "queriesTripsListQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "379e8d60eae73ac3966c01fdc973ca20",
    "id": null,
    "metadata": {},
    "name": "queriesTripsListQuery",
    "operationKind": "query",
    "text": "query queriesTripsListQuery(\n  $first: Int!\n) {\n  tripsCollection(first: $first) {\n    edges {\n      node {\n        id\n        name\n        description\n        is_published\n        created_at\n        trips_summary_geometry_geojson\n        bounds_min_lat\n        bounds_min_lng\n        bounds_max_lat\n        bounds_max_lng\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5c332410f8794ae65f165f98b3f3bf33";

export default node;
