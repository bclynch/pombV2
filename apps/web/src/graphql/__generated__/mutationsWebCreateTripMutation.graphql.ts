/**
 * @generated SignedSource<<d0d8dc43bbce6d73da47ad30ea5e14f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type tripsInsertInput = {
  bounds_max_lat?: number | null | undefined;
  bounds_max_lng?: number | null | undefined;
  bounds_min_lat?: number | null | undefined;
  bounds_min_lng?: number | null | undefined;
  created_at?: any | null | undefined;
  description?: string | null | undefined;
  end_date?: any | null | undefined;
  id?: any | null | undefined;
  is_published?: boolean | null | undefined;
  name?: string | null | undefined;
  start_date?: any | null | undefined;
  summary_geometry?: any | null | undefined;
  user_id?: any | null | undefined;
};
export type mutationsWebCreateTripMutation$variables = {
  input: ReadonlyArray<tripsInsertInput>;
};
export type mutationsWebCreateTripMutation$data = {
  readonly insertIntotripsCollection: {
    readonly affectedCount: number;
    readonly records: ReadonlyArray<{
      readonly bounds_max_lat: number | null | undefined;
      readonly bounds_max_lng: number | null | undefined;
      readonly bounds_min_lat: number | null | undefined;
      readonly bounds_min_lng: number | null | undefined;
      readonly created_at: any | null | undefined;
      readonly description: string | null | undefined;
      readonly id: any;
      readonly is_published: boolean | null | undefined;
      readonly name: string;
      readonly start_date: any | null | undefined;
      readonly trips_summary_geometry_geojson: string | null | undefined;
    }>;
  } | null | undefined;
};
export type mutationsWebCreateTripMutation = {
  response: mutationsWebCreateTripMutation$data;
  variables: mutationsWebCreateTripMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "objects",
        "variableName": "input"
      }
    ],
    "concreteType": "tripsInsertResponse",
    "kind": "LinkedField",
    "name": "insertIntotripsCollection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "affectedCount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "trips",
        "kind": "LinkedField",
        "name": "records",
        "plural": true,
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
    "name": "mutationsWebCreateTripMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "mutationsWebCreateTripMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2ba70fd940406d5f5e257243bf613911",
    "id": null,
    "metadata": {},
    "name": "mutationsWebCreateTripMutation",
    "operationKind": "mutation",
    "text": "mutation mutationsWebCreateTripMutation(\n  $input: [tripsInsertInput!]!\n) {\n  insertIntotripsCollection(objects: $input) {\n    affectedCount\n    records {\n      id\n      name\n      description\n      is_published\n      created_at\n      start_date\n      trips_summary_geometry_geojson\n      bounds_min_lat\n      bounds_min_lng\n      bounds_max_lat\n      bounds_max_lng\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6d1b9bdc5aed3842bb744670a9ad80d4";

export default node;
