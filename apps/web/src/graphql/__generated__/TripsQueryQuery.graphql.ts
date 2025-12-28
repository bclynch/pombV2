/**
 * @generated SignedSource<<6c3ea7ff5c30628820f3984357c7266f>>
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
        readonly created_at: any | null | undefined;
        readonly description: string | null | undefined;
        readonly id: any;
        readonly is_published: boolean | null | undefined;
        readonly name: string;
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
    "cacheID": "c1293eb3ea09f256dbf206a0be9154c2",
    "id": null,
    "metadata": {},
    "name": "TripsQueryQuery",
    "operationKind": "query",
    "text": "query TripsQueryQuery(\n  $first: Int!\n) {\n  tripsCollection(first: $first) {\n    edges {\n      node {\n        id\n        name\n        description\n        is_published\n        created_at\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2aaf9db8b51c6a07fa80257aae5cb4f8";

export default node;
