/**
 * @generated SignedSource<<46c2fae27e5a536647de2016cc93011e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PhotoCarousel_trip$data = {
  readonly photosCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly blurhash: string | null | undefined;
        readonly captured_at: any | null | undefined;
        readonly id: any;
        readonly r2_key_large: string | null | undefined;
        readonly r2_key_thumb: string | null | undefined;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentType": "PhotoCarousel_trip";
};
export type PhotoCarousel_trip$key = {
  readonly " $data"?: PhotoCarousel_trip$data;
  readonly " $fragmentSpreads": FragmentRefs<"PhotoCarousel_trip">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PhotoCarousel_trip",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        },
        {
          "kind": "Literal",
          "name": "orderBy",
          "value": [
            {
              "captured_at": "AscNullsLast"
            }
          ]
        }
      ],
      "concreteType": "photosConnection",
      "kind": "LinkedField",
      "name": "photosCollection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "photosEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "photos",
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
                  "name": "r2_key_thumb",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "r2_key_large",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "blurhash",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "captured_at",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "photosCollection(first:100,orderBy:[{\"captured_at\":\"AscNullsLast\"}])"
    }
  ],
  "type": "trips",
  "abstractKey": null
};

(node as any).hash = "a38bc9727feef0b27e498f080ec4a826";

export default node;
