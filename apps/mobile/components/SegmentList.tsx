import { useState } from "react";
import { Alert, TextInput as RNTextInput } from "react-native";
import { graphql, useFragment } from "react-relay";
import { Box, VStack, HStack } from "@coinbase/cds-mobile/layout";
import { TextTitle3 } from "@coinbase/cds-mobile/typography/TextTitle3";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { TextLabel2 } from "@coinbase/cds-mobile/typography/TextLabel2";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
import { supabase } from "@/lib/supabase";
import type { SegmentListMobile_trip$key, SegmentListMobile_trip$data } from "./__generated__/SegmentListMobile_trip.graphql";

type Segment = NonNullable<SegmentListMobile_trip$data['trip_segmentsCollection']>['edges'][number]['node'];

type SegmentListProps = {
  tripRef: SegmentListMobile_trip$key;
  onSegmentsChange?: () => void;
};

export function SegmentList({ tripRef, onSegmentsChange }: SegmentListProps) {
  const data = useFragment(graphql`
    fragment SegmentListMobile_trip on trips {
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
  `, tripRef);
  const tripId = data.id;
  const segments = data.trip_segmentsCollection?.edges?.map((e) => e.node) ?? [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartEdit = (segment: Segment) => {
    setEditingId(segment.id);
    setEditingName(segment.name || "");
  };

  const handleSaveEdit = async () => {
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
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (segmentId: string, segmentName: string) => {
    Alert.alert(
      "Delete Segment",
      `Are you sure you want to delete "${segmentName || "Untitled"}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setError(null);
            const { error: deleteError } = await supabase
              .from("trip_segments")
              .delete()
              .eq("id", segmentId);

            if (deleteError) {
              setError(`Failed to delete: ${deleteError.message}`);
              return;
            }

            setSelectedIds((prev) => {
              const next = new Set(prev);
              next.delete(segmentId);
              return next;
            });
            onSegmentsChange?.();
          },
        },
      ]
    );
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    setError(null);

    const currentSegment = segments[index];
    const prevSegment = segments[index - 1];

    const currentOrder = currentSegment.sort_order ?? index;
    const prevOrder = prevSegment.sort_order ?? (index - 1);

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
  };

  const handleMoveDown = async (index: number) => {
    if (index === segments.length - 1) return;
    setError(null);

    const currentSegment = segments[index];
    const nextSegment = segments[index + 1];

    const currentOrder = currentSegment.sort_order ?? index;
    const nextOrder = nextSegment.sort_order ?? (index + 1);

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
  };

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

  const handleMerge = async () => {
    if (selectedIds.size < 2) return;
    setIsMerging(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in");
      }
      const userId = session.session.user.id;

      const selectedSegments = segments
        .filter((s) => selectedIds.has(s.id))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      const { data: geometryData, error: fetchError } = await supabase
        .from("trip_segments")
        .select("id, geometry")
        .in("id", Array.from(selectedIds));

      if (fetchError) throw new Error(fetchError.message);

      const geometries = await Promise.all(
        geometryData.map(async (seg: { id: string }) => {
          const { data: geojson } = await supabase
            .rpc("get_segment_geometry_geojson" as never, { segment_id: seg.id } as never);
          return geojson ? JSON.parse(geojson as string) : null;
        })
      );

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

      const wktCoords = allCoordinates
        .map((line) => `(${line.map((c) => `${c[0]} ${c[1]}`).join(", ")})`)
        .join(", ");
      const wkt = `SRID=4326;MULTILINESTRING(${wktCoords})`;

      const mergedName = selectedSegments
        .map((s) => s.name || "Untitled")
        .join(" + ");

      const minSortOrder = Math.min(...selectedSegments.map((s) => s.sort_order ?? 0));

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

      const oldSegmentIds = Array.from(selectedIds);
      await supabase
        .from("trip_uploads")
        .update({ segment_id: newSegment.id })
        .in("segment_id", oldSegmentIds);

      await supabase
        .from("photos")
        .update({ segment_id: newSegment.id })
        .in("segment_id", oldSegmentIds);

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
  };

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
            onPress={handleMerge}
            disabled={isMerging}
          >
            {isMerging ? "Merging..." : `Merge ${selectedIds.size}`}
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
          <Pressable
            key={segment.id}
            onLongPress={() => toggleSelection(segment.id)}
          >
            <Box
              padding={3}
              background={selectedIds.has(segment.id) ? "bgPrimary" : "bgAlternate"}
              borderRadius={200}
            >
              {editingId === segment.id ? (
                <VStack gap={2}>
                  <RNTextInput
                    value={editingName}
                    onChangeText={setEditingName}
                    autoFocus
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 16,
                    }}
                  />
                  <HStack gap={2}>
                    <Button onPress={handleSaveEdit}>
                      Save
                    </Button>
                    <Button variant="secondary" onPress={handleCancelEdit}>
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack gap={2}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Pressable onPress={() => handleStartEdit(segment)} style={{ flex: 1 }}>
                      <VStack gap={0}>
                        <TextBody>{segment.name || "Untitled"}</TextBody>
                        {segment.trip_uploadsCollection?.edges.length ? (
                          <TextLabel2 color="fgMuted" numberOfLines={1}>
                            {segment.trip_uploadsCollection.edges.map((e) => e.node.filename).join(", ")}
                          </TextLabel2>
                        ) : null}
                      </VStack>
                    </Pressable>
                    {selectedIds.has(segment.id) && (
                      <Box
                        width={24}
                        height={24}
                        borderRadius={100}
                        background="bgPrimary"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <TextBody color="fgPrimary">✓</TextBody>
                      </Box>
                    )}
                  </HStack>
                  <HStack gap={2}>
                    <Button
                      variant="secondary"
                      onPress={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="secondary"
                      onPress={() => handleMoveDown(index)}
                      disabled={index === segments.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="negative"
                      onPress={() => handleDelete(segment.id, segment.name || "")}
                    >
                      Delete
                    </Button>
                  </HStack>
                </VStack>
              )}
            </Box>
          </Pressable>
        ))}
      </VStack>
    </VStack>
  );
}
