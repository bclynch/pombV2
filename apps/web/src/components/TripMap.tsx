import { useEffect, useRef } from "react";
import { Box } from "@coinbase/cds-web/layout";
import { TextBody } from "@coinbase/cds-web/typography";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, LineString, MultiLineString, Position } from "geojson";

type TripMapProps = {
  geojson: Feature<LineString | MultiLineString>;
  bounds?: {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
  };
  style?: React.CSSProperties;
};

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export function TripMap({ geojson, bounds: propBounds, style }: TripMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const hasValidGeometry = Boolean(geojson?.geometry);

  useEffect(() => {
    if (!hasValidGeometry || !mapContainer.current || map.current) return;

    // Get first coordinate for initial center
    const getFirstCoordinate = (): Position => {
      if (!geojson?.geometry) {
        return [-122.4194, 37.7749];
      }
      if (geojson.geometry.type === "LineString") {
        return geojson.geometry.coordinates[0] || [-122.4194, 37.7749];
      } else if (geojson.geometry.type === "MultiLineString") {
        return geojson.geometry.coordinates[0]?.[0] || [-122.4194, 37.7749];
      }
      return [-122.4194, 37.7749];
    };

    const firstCoord = getFirstCoordinate();

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      center: firstCoord as [number, number],
      zoom: 12,
    });

    // Handle missing images gracefully
    map.current.on("styleimagemissing", (e) => {
      const id = e.id;
      // Create a transparent 1x1 placeholder image
      if (!map.current?.hasImage(id)) {
        map.current?.addImage(id, { width: 1, height: 1, data: new Uint8Array(4) });
      }
    });

    map.current.on("load", () => {
      if (!map.current || !geojson?.geometry) return;

      map.current.addSource("route", {
        type: "geojson",
        data: geojson,
      });

      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      });

      // Fit map to bounds
      if (propBounds) {
        map.current.fitBounds(
          [
            [propBounds.minLng, propBounds.minLat],
            [propBounds.maxLng, propBounds.maxLat],
          ],
          { padding: 50 }
        );
      } else {
        // Calculate bounds from geometry
        const allCoords: Position[] = [];
        if (geojson.geometry.type === "LineString") {
          allCoords.push(...geojson.geometry.coordinates);
        } else if (geojson.geometry.type === "MultiLineString") {
          geojson.geometry.coordinates.forEach((line) => allCoords.push(...line));
        }

        if (allCoords.length > 0) {
          const bounds = allCoords.reduce(
            (bounds, coord) => bounds.extend(coord as [number, number]),
            new maplibregl.LngLatBounds(allCoords[0] as [number, number], allCoords[0] as [number, number])
          );
          map.current.fitBounds(bounds, { padding: 50 });
        }
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [geojson, propBounds, hasValidGeometry]);

  // Show placeholder if geojson is invalid
  if (!hasValidGeometry) {
    return (
      <Box
        width="100%"
        height={300}
        style={style}
        background="bgTertiary"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius={200}
      >
        <TextBody color="fgMuted">No route data</TextBody>
      </Box>
    );
  }

  const height = typeof style?.height === 'number' ? style.height : 300;

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        minWidth: 300,
        height: `${height}px`,
        display: "block",
      }}
    />
  );
}
