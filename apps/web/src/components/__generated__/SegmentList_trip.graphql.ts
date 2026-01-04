/**
 * @generated SignedSource<<dbf57143c6ff37e2f21ab724af48b166>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SegmentList_trip$data = {
  readonly id: any;
  readonly trip_segmentsCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly created_at: any | null | undefined;
        readonly description: string | null | undefined;
        readonly id: any;
        readonly name: string | null | undefined;
        readonly sort_order: number | null | undefined;
        readonly trip_uploadsCollection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly filename: string;
              readonly id: any;
            };
          }>;
        } | null | undefined;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentType": "SegmentList_trip";
};
export type SegmentList_trip$key = {
  readonly " $data"?: SegmentList_trip$data;
  readonly " $fragmentSpreads": FragmentRefs<"SegmentList_trip">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SegmentList_trip",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "orderBy",
          "value": [
            {
              "sort_order": "AscNullsLast"
            }
          ]
        }
      ],
      "concreteType": "trip_segmentsConnection",
      "kind": "LinkedField",
      "name": "trip_segmentsCollection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "trip_segmentsEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "trip_segments",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
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
                  "name": "sort_order",
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
                  "concreteType": "trip_uploadsConnection",
                  "kind": "LinkedField",
                  "name": "trip_uploadsCollection",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "trip_uploadsEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "trip_uploads",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            (v0/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "filename",
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
      "storageKey": "trip_segmentsCollection(orderBy:[{\"sort_order\":\"AscNullsLast\"}])"
    }
  ],
  "type": "trips",
  "abstractKey": null
};
})();

(node as any).hash = "c7811633a0ea4198a61fceb20dbea660";

export default node;
