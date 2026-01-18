/**
 * @generated SignedSource<<5d54a94e61a4600bb79926018cab4cd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PhotoCarouselMobile_trip$data = {
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
  readonly " $fragmentType": "PhotoCarouselMobile_trip";
};
export type PhotoCarouselMobile_trip$key = {
  readonly " $data"?: PhotoCarouselMobile_trip$data;
  readonly " $fragmentSpreads": FragmentRefs<"PhotoCarouselMobile_trip">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PhotoCarouselMobile_trip",
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

(node as any).hash = "80480caf9eba9b40f9b00cead147b499";

export default node;
