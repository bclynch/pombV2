import React, { useEffect, useRef } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  type CameraRef,
} from "@maplibre/maplibre-react-native";
import type { Feature, LineString } from "geojson";

type TripMapProps = {
  geojson: Feature<LineString>;
  style?: ViewStyle;
};

const MAPTILER_API_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;

export function TripMap({ geojson, style }: TripMapProps) {
  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    if (cameraRef.current && geojson.geometry.coordinates.length > 0) {
      const coordinates = geojson.geometry.coordinates;

      // Calculate bounds
      let minLng = coordinates[0][0];
      let maxLng = coordinates[0][0];
      let minLat = coordinates[0][1];
      let maxLat = coordinates[0][1];

      coordinates.forEach(([lng, lat]) => {
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });

      cameraRef.current.fitBounds(
        [maxLng, maxLat],
        [minLng, minLat],
        50,
        500
      );
    }
  }, [geojson]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}
        logoEnabled={false}
      >
        <Camera
          // ref={cameraRef}
          defaultSettings={{
            centerCoordinate: geojson.geometry.coordinates[0],
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
