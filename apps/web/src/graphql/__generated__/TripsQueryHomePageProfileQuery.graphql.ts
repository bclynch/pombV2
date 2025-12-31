/**
 * @generated SignedSource<<6d0f997ad9e5ca9a56f7ca66d84c25bf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TripsQueryHomePageProfileQuery$variables = {
  userId: any;
};
export type TripsQueryHomePageProfileQuery$data = {
  readonly profilesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly username: string | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type TripsQueryHomePageProfileQuery = {
  response: TripsQueryHomePageProfileQuery$data;
  variables: TripsQueryHomePageProfileQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
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
                "variableName": "userId"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "username",
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
    "name": "TripsQueryHomePageProfileQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TripsQueryHomePageProfileQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "272f08326f21ec644148ccf49c7ea606",
    "id": null,
    "metadata": {},
    "name": "TripsQueryHomePageProfileQuery",
    "operationKind": "query",
    "text": "query TripsQueryHomePageProfileQuery(\n  $userId: UUID!\n) {\n  profilesCollection(filter: {id: {eq: $userId}}, first: 1) {\n    edges {\n      node {\n        username\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ea3bd45ccb75d17b653577cb9f39a66c";

export default node;
