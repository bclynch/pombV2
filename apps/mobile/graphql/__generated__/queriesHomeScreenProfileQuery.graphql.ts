/**
 * @generated SignedSource<<b6ca87ccfa545939f72649a763460d73>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type queriesHomeScreenProfileQuery$variables = {
  userId: any;
};
export type queriesHomeScreenProfileQuery$data = {
  readonly profilesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly username: string | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type queriesHomeScreenProfileQuery = {
  response: queriesHomeScreenProfileQuery$data;
  variables: queriesHomeScreenProfileQuery$variables;
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
    "name": "queriesHomeScreenProfileQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "queriesHomeScreenProfileQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b4b9e6a2e525d1426ad1cd577affb4df",
    "id": null,
    "metadata": {},
    "name": "queriesHomeScreenProfileQuery",
    "operationKind": "query",
    "text": "query queriesHomeScreenProfileQuery(\n  $userId: UUID!\n) {\n  profilesCollection(filter: {id: {eq: $userId}}, first: 1) {\n    edges {\n      node {\n        username\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4d9b7f91e8ddf2631ae577c5aef14189";

export default node;
