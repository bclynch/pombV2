import React, { useEffect, useRef, useMemo, useState } from "react";
import type { ViewStyle } from "react-native";
import * as turf from "@turf/turf";
import { Box } from "@coinbase/cds-mobile/layout/Box";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import type { Feature, LineString, MultiLineString, Position } from "geojson";

// Lazy import MapLibre to handle Expo Go where it's not available
let MapView: typeof import("@maplibre/maplibre-react-native").MapView | null = null;
let Camera: typeof import("@maplibre/maplibre-react-native").Camera | null = null;
let ShapeSource: typeof import("@maplibre/maplibre-react-native").ShapeSource | null = null;
let LineLayer: typeof import("@maplibre/maplibre-react-native").LineLayer | null = null;
type CameraRef = import("@maplibre/maplibre-react-native").CameraRef;

let mapLibreAvailable = false;
try {
  const maplibre = require("@maplibre/maplibre-react-native");
  MapView = maplibre.MapView;
  Camera = maplibre.Camera;
  ShapeSource = maplibre.ShapeSource;
  LineLayer = maplibre.LineLayer;
  mapLibreAvailable = true;
} catch {
  // MapLibre not available (Expo Go)
}

type TripMapProps = {
  geojson: Feature<LineString | MultiLineString>;
  bounds?: {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
  };
  style?: ViewStyle;
};

const MAPTILER_API_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;

export function TripMap({ geojson, bounds: propBounds, style }: TripMapProps) {
  const cameraRef = useRef<CameraRef | null>(null);

  // Calculate bounds from geojson or use provided bounds
  const bounds = useMemo(() => {
    if (propBounds) {
      return propBounds;
    }

    if (!geojson?.geometry) {
      return null;
    }

    const bbox = turf.bbox(geojson);
    return {
      minLng: bbox[0],
      minLat: bbox[1],
      maxLng: bbox[2],
      maxLat: bbox[3],
    };
  }, [geojson, propBounds]);

  // Get the first coordinate for initial camera position
  const firstCoordinate = useMemo((): Position => {
    if (!geojson?.geometry) {
      return [-122.4194, 37.7749];
    }
    if (geojson.geometry.type === "LineString") {
      return geojson.geometry.coordinates[0] || [-122.4194, 37.7749];
    } else if (geojson.geometry.type === "MultiLineString") {
      return geojson.geometry.coordinates[0]?.[0] || [-122.4194, 37.7749];
    }
    return [-122.4194, 37.7749];
  }, [geojson]);

  useEffect(() => {
    if (cameraRef.current && bounds) {
      cameraRef.current.fitBounds(
        [bounds.maxLng, bounds.maxLat],
        [bounds.minLng, bounds.minLat],
        50,
        500
      );
    }
  }, [bounds]);

  // Show placeholder if geojson is invalid
  if (!geojson?.geometry) {
    return (
      <Box
        height={300}
        borderRadius={200}
        overflow="hidden"
        style={style}
        background="bgTertiary"
        justifyContent="center"
        alignItems="center"
      >
        <TextBody color="fgMuted">No route data</TextBody>
      </Box>
    );
  }

  // Show placeholder if MapLibre is not available (Expo Go)
  if (!mapLibreAvailable || !MapView || !Camera || !ShapeSource || !LineLayer) {
    return (
      <Box
        height={300}
        borderRadius={200}
        overflow="hidden"
        style={style}
        background="bgTertiary"
        justifyContent="center"
        alignItems="center"
      >
        <TextBody color="fgMuted">Map requires development build</TextBody>
      </Box>
    );
  }

  return (
    <Box height={300} borderRadius={200} overflow="hidden" style={style}>
      <MapView
        style={{ flex: 1 }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}
        logoEnabled={false}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: firstCoordinate,
            zoomLevel: 12,
          }}
        />
        <ShapeSource id="route" shape={geojson}>
          <LineLayer
            id="route-line"
            style={{
              lineColor: "#3b82f6",
              lineWidth: 4,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </ShapeSource>
      </MapView>
    </Box>
  );
}
