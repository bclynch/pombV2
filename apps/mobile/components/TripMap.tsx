import React, { useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  type CameraRef,
} from "@maplibre/maplibre-react-native";
import * as turf from "@turf/turf";
import type { Feature, LineString, MultiLineString, Position } from "geojson";

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
  const cameraRef = useRef<CameraRef>(null);

  // Calculate bounds from geojson or use provided bounds
  const bounds = useMemo(() => {
    if (propBounds) {
      return propBounds;
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

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
