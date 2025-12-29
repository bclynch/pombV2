import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, LineString } from "geojson";

type TripMapProps = {
  geojson: Feature<LineString>;
  style?: React.CSSProperties;
};

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export function TripMap({ geojson, style }: TripMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      center: geojson.geometry.coordinates[0],
      zoom: 12,
    });

    map.current.on("load", () => {
      if (!map.current) return;

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

      // Fit map to the line bounds
      const coordinates = geojson.geometry.coordinates;
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );

      map.current.fitBounds(bounds, { padding: 50 });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [geojson]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px", ...style }}
    />
  );
}
