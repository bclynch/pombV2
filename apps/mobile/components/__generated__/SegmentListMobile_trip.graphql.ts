/**
 * @generated SignedSource<<a2fc0ccceaca0403d2ce29fb22678e2f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SegmentListMobile_trip$data = {
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
  readonly " $fragmentType": "SegmentListMobile_trip";
};
export type SegmentListMobile_trip$key = {
  readonly " $data"?: SegmentListMobile_trip$data;
  readonly " $fragmentSpreads": FragmentRefs<"SegmentListMobile_trip">;
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
  "name": "SegmentListMobile_trip",
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

(node as any).hash = "515daf0f872d97df85ee3c490119eea9";

export default node;
