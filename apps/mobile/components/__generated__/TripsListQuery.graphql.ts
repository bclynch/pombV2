/**
 * @generated SignedSource<<7aaf93cfc505643cec177f5ac9c11aaf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TripsListQuery$variables = {
  first: number;
};
export type TripsListQuery$data = {
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
export type TripsListQuery = {
  response: TripsListQuery$data;
  variables: TripsListQuery$variables;
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
    "name": "TripsListQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TripsListQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "158444a52730dec46ef8671944e47388",
    "id": null,
    "metadata": {},
    "name": "TripsListQuery",
    "operationKind": "query",
    "text": "query TripsListQuery(\n  $first: Int!\n) {\n  tripsCollection(first: $first) {\n    edges {\n      node {\n        id\n        name\n        description\n        is_published\n        created_at\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d8451b5b9a4aad6cbe7d9c791fa6777e";

export default node;
