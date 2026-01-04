import { useState, useCallback } from "react";
import { graphql, useFragment } from "react-relay";
import { TextTitle3, TextBody, TextLabel2 } from "@coinbase/cds-web/typography";
import { Box, VStack, HStack } from "@coinbase/cds-web/layout";
import { Button } from "@coinbase/cds-web/buttons";
import { TextInput } from "@coinbase/cds-web/controls";
import { supabase } from "../lib/supabase";
import type { SegmentList_trip$key } from "./__generated__/SegmentList_trip.graphql";

const SegmentListFragment = graphql`
  fragment SegmentList_trip on trips {
    id
    trip_segmentsCollection(orderBy: [{ sort_order: AscNullsLast }]) {
      edges {
        node {
          id
          name
          description
          sort_order
          created_at
          trip_uploadsCollection {
            edges {
              node {
                id
                filename
              }
            }
          }
        }
      }
    }
  }
`;

type SegmentListProps = {
  tripRef: SegmentList_trip$key;
  onSegmentsChange?: () => void;
};

export function SegmentList({ tripRef, onSegmentsChange }: SegmentListProps) {
  const data = useFragment(SegmentListFragment, tripRef);
  const tripId = data.id;
  const segments = data.trip_segmentsCollection?.edges?.map((e) => e.node) ?? [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartEdit = (segment: Segment) => {
    setEditingId(segment.id);
    setEditingName(segment.name || "");
  };

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return;
    setError(null);

    const { error: updateError } = await supabase
      .from("trip_segments")
      .update({ name: editingName })
      .eq("id", editingId);

    if (updateError) {
      setError(`Failed to update: ${updateError.message}`);
      return;
    }

    setEditingId(null);
    setEditingName("");
    onSegmentsChange?.();
  }, [editingId, editingName, onSegmentsChange]);

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = useCallback(async (segmentId: string, segmentName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${segmentName || "Untitled"}"?`);
    if (!confirmed) return;

    setIsDeleting(segmentId);
    setError(null);

    const { error: deleteError } = await supabase
      .from("trip_segments")
      .delete()
      .eq("id", segmentId);

    if (deleteError) {
      setError(`Failed to delete: ${deleteError.message}`);
      setIsDeleting(null);
      return;
    }

    setIsDeleting(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(segmentId);
      return next;
    });
    onSegmentsChange?.();
  }, [onSegmentsChange]);

  const handleMoveUp = useCallback(async (index: number) => {
    if (index === 0) return;
    setError(null);

    const currentSegment = segments[index];
    const prevSegment = segments[index - 1];

    const currentOrder = currentSegment.sort_order ?? index;
    const prevOrder = prevSegment.sort_order ?? (index - 1);

    // Swap sort orders
    const { error: error1 } = await supabase
      .from("trip_segments")
      .update({ sort_order: prevOrder })
      .eq("id", currentSegment.id);

    if (error1) {
      setError(`Failed to reorder: ${error1.message}`);
      return;
    }

    const { error: error2 } = await supabase
      .from("trip_segments")
      .update({ sort_order: currentOrder })
      .eq("id", prevSegment.id);

    if (error2) {
      setError(`Failed to reorder: ${error2.message}`);
      return;
    }

    onSegmentsChange?.();
  }, [segments, onSegmentsChange]);

  const handleMoveDown = useCallback(async (index: number) => {
    if (index === segments.length - 1) return;
    setError(null);

    const currentSegment = segments[index];
    const nextSegment = segments[index + 1];

    const currentOrder = currentSegment.sort_order ?? index;
    const nextOrder = nextSegment.sort_order ?? (index + 1);

    // Swap sort orders
    const { error: error1 } = await supabase
      .from("trip_segments")
      .update({ sort_order: nextOrder })
      .eq("id", currentSegment.id);

    if (error1) {
      setError(`Failed to reorder: ${error1.message}`);
      return;
    }

    const { error: error2 } = await supabase
      .from("trip_segments")
      .update({ sort_order: currentOrder })
      .eq("id", nextSegment.id);

    if (error2) {
      setError(`Failed to reorder: ${error2.message}`);
      return;
    }

    onSegmentsChange?.();
  }, [segments, onSegmentsChange]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleMerge = useCallback(async () => {
    if (selectedIds.size < 2) return;
    setIsMerging(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in");
      }
      const userId = session.session.user.id;

      // Get selected segments ordered by sort_order
      const selectedSegments = segments
        .filter((s) => selectedIds.has(s.id))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      // Fetch geometries for selected segments
      const { data: geometryData, error: fetchError } = await supabase
        .from("trip_segments")
        .select("id, geometry")
        .in("id", Array.from(selectedIds));

      if (fetchError) throw new Error(fetchError.message);

      // Get GeoJSON for each segment
      const geometries = await Promise.all(
        geometryData.map(async (seg) => {
          const { data: geojson } = await supabase
            .rpc("get_segment_geometry_geojson" as never, { segment_id: seg.id } as never);
          return geojson ? JSON.parse(geojson as string) : null;
        })
      );

      // Combine coordinates into MultiLineString
      const allCoordinates: number[][][] = [];
      for (const geom of geometries) {
        if (!geom) continue;
        if (geom.type === "MultiLineString") {
          allCoordinates.push(...geom.coordinates);
        } else if (geom.type === "LineString") {
          allCoordinates.push(geom.coordinates);
        }
      }

      if (allCoordinates.length === 0) {
        throw new Error("No geometry data found in selected segments");
      }

      // Create WKT for merged geometry
      const wktCoords = allCoordinates
        .map((line) => `(${line.map((c) => `${c[0]} ${c[1]}`).join(", ")})`)
        .join(", ");
      const wkt = `SRID=4326;MULTILINESTRING(${wktCoords})`;

      // Create merged segment name
      const mergedName = selectedSegments
        .map((s) => s.name || "Untitled")
        .join(" + ");

      // Get min sort_order from selected segments
      const minSortOrder = Math.min(...selectedSegments.map((s) => s.sort_order ?? 0));

      // Create new merged segment
      const { data: newSegment, error: insertError } = await supabase
        .from("trip_segments")
        .insert({
          trip_id: tripId,
          user_id: userId,
          name: mergedName,
          geometry: wkt,
          sort_order: minSortOrder,
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);

      // Update trip_uploads to point to new segment
      const oldSegmentIds = Array.from(selectedIds);
      await supabase
        .from("trip_uploads")
        .update({ segment_id: newSegment.id })
        .in("segment_id", oldSegmentIds);

      // Update photos to point to new segment
      await supabase
        .from("photos")
        .update({ segment_id: newSegment.id })
        .in("segment_id", oldSegmentIds);

      // Delete old segments
      const { error: deleteError } = await supabase
        .from("trip_segments")
        .delete()
        .in("id", oldSegmentIds);

      if (deleteError) throw new Error(deleteError.message);

      setSelectedIds(new Set());
      onSegmentsChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merge failed");
    } finally {
      setIsMerging(false);
    }
  }, [selectedIds, segments, tripId, onSegmentsChange]);

  if (segments.length === 0) {
    return (
      <Box padding={3} background="bgAlternate" borderRadius={200}>
        <TextBody color="fgMuted">No segments yet. Upload GPX files to create segments.</TextBody>
      </Box>
    );
  }

  return (
    <VStack gap={3}>
      <HStack justifyContent="space-between" alignItems="center">
        <TextTitle3>Segments</TextTitle3>
        {selectedIds.size >= 2 && (
          <Button
            variant="secondary"
            onClick={handleMerge}
            disabled={isMerging}
          >
            {isMerging ? "Merging..." : `Merge ${selectedIds.size} segments`}
          </Button>
        )}
      </HStack>

      {error && (
        <Box padding={2} background="bgNegative" borderRadius={200}>
          <TextBody color="fgNegative">{error}</TextBody>
        </Box>
      )}

      <VStack gap={2}>
        {segments.map((segment, index) => (
          <Box
            key={segment.id}
            padding={3}
            background={selectedIds.has(segment.id) ? "bgPrimary" : "bgAlternate"}
            borderRadius={200}
          >
            <HStack justifyContent="space-between" alignItems="center" gap={2}>
              <HStack alignItems="center" gap={2} flexGrow={1}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(segment.id)}
                  onChange={() => toggleSelection(segment.id)}
                />
                {editingId === segment.id ? (
                  <HStack gap={2} alignItems="center" flexGrow={1}>
                    <TextInput
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                    <Button onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </HStack>
                ) : (
                  <VStack gap={0.5} flexGrow={1}>
                    <TextBody
                      onClick={() => handleStartEdit(segment)}
                      style={{ cursor: "pointer" }}
                    >
                      {segment.name || "Untitled"}
                    </TextBody>
                    {segment.trip_uploadsCollection?.edges.length ? (
                      <TextLabel2 color="fgMuted">
                        {segment.trip_uploadsCollection.edges.map((e) => e.node.filename).join(", ")}
                      </TextLabel2>
                    ) : null}
                  </VStack>
                )}
              </HStack>

              {editingId !== segment.id && (
                <HStack gap={1}>
                  <Button
                    variant="secondary"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === segments.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="negative"
                    onClick={() => handleDelete(segment.id, segment.name || "")}
                    disabled={isDeleting === segment.id}
                  >
                    Delete
                  </Button>
                </HStack>
              )}
            </HStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
