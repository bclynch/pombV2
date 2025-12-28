/**
 * @generated SignedSource<<9dfba9e3a59beaa23cd04c5acc58d63f>>
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
        readonly created_at: any | null | undefined;
        readonly description: string | null | undefined;
        readonly id: any;
        readonly is_published: boolean | null | undefined;
        readonly name: string;
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
    "cacheID": "d313961d81882c4b2600492837509710",
    "id": null,
    "metadata": {},
    "name": "queriesTripsListQuery",
    "operationKind": "query",
    "text": "query queriesTripsListQuery(\n  $first: Int!\n) {\n  tripsCollection(first: $first) {\n    edges {\n      node {\n        id\n        name\n        description\n        is_published\n        created_at\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0650225242ce8dbba99b6cf2064877a8";

export default node;
