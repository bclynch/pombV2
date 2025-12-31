/**
 * @generated SignedSource<<2790caf7f7afc4817b608d1f285d5f0c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TripsQueryQuery$variables = {
  first: number;
};
export type TripsQueryQuery$data = {
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
export type TripsQueryQuery = {
  response: TripsQueryQuery$data;
  variables: TripsQueryQuery$variables;
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
    "name": "TripsQueryQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TripsQueryQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ad84fc53d41d75c645f038c968cc6092",
    "id": null,
    "metadata": {},
    "name": "TripsQueryQuery",
    "operationKind": "query",
    "text": "query TripsQueryQuery(\n  $first: Int!\n) {\n  tripsCollection(first: $first) {\n    edges {\n      node {\n        id\n        name\n        description\n        is_published\n        created_at\n        trips_summary_geometry_geojson\n        bounds_min_lat\n        bounds_min_lng\n        bounds_max_lat\n        bounds_max_lng\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "25ef031d36953dff5083bb0e3ea6a7d0";

export default node;
