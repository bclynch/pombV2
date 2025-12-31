import { useState, useCallback, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { Button } from "@coinbase/cds-web/buttons";
import { TextTitle1, TextTitle3, TextBody } from "@coinbase/cds-web/typography";
import { HStack, VStack } from "@coinbase/cds-web/layout";
import { RelayProvider } from "../components/RelayProvider";
import { AvatarUpload } from "../components/AvatarUpload";
import { useAuth } from "../lib/AuthContext";
import type { ProfileQueryWebQuery } from "../graphql/__generated__/ProfileQueryWebQuery.graphql";
import ProfileQueryNode from "../graphql/__generated__/ProfileQueryWebQuery.graphql";
import CreateTripMutationNode from "../graphql/__generated__/mutationsWebCreateTripMutation.graphql";

function ProfileContent({ username }: { username: string }) {
  const { user } = useAuth();
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [tripName, setTripName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const data = useLazyLoadQuery<ProfileQueryWebQuery>(
    ProfileQueryNode,
    { username },
    { fetchPolicy: "store-and-network", fetchKey }
  );

  const [commitCreateTrip, isCreating] = useMutation(CreateTripMutationNode);

  const profile = data.profilesCollection?.edges?.[0]?.node;
  const isOwner = user?.id === profile?.id;
  const trips = profile?.tripsCollection?.edges ?? [];

  const handleCreateTrip = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!tripName.trim() || !user?.id) return;

      commitCreateTrip({
        variables: {
          input: [
            {
              name: tripName.trim(),
              user_id: user.id,
              is_published: false,
            },
          ],
        },
        onCompleted: () => {
          setTripName("");
          setShowNewTripModal(false);
          setFetchKey((k) => k + 1); // Refetch to show new trip
        },
        onError: (error) => {
          alert(error.message);
        },
      });
    },
    [tripName, user?.id, commitCreateTrip]
  );

  if (!profile) {
    return (
      <div style={styles.container}>
        <TextBody>User not found</TextBody>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Profile Header */}
      <header style={styles.header}>
        <div style={styles.avatarContainer}>
          {isOwner ? (
            <AvatarUpload
              userId={profile.id}
              currentAvatarUrl={avatarUrl ?? profile.avatar_url}
              username={profile.username}
              onUploadComplete={setAvatarUrl}
            />
          ) : (avatarUrl ?? profile.avatar_url) ? (
            <img
              src={avatarUrl ?? profile.avatar_url}
              alt={profile.username ?? "Avatar"}
              style={styles.avatar}
            />
          ) : (
            <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>
              <TextTitle1>
                {profile.username?.charAt(0).toUpperCase() ?? "?"}
              </TextTitle1>
            </div>
          )}
        </div>
        <VStack gap={2} align="center">
          <TextTitle1>{profile.username}</TextTitle1>
          {profile.bio && (
            <TextBody style={styles.bio}>{profile.bio}</TextBody>
          )}
          {isOwner && (
            <HStack gap={3} style={styles.actions}>
              <Button variant="primary" onClick={() => setShowNewTripModal(true)}>
                New Trip
              </Button>
            </HStack>
          )}
        </VStack>
      </header>

      {/* Trips Grid */}
      <section style={styles.tripsSection}>
        <TextTitle3 style={styles.sectionTitle}>Trips</TextTitle3>
        {trips.length === 0 ? (
          <TextBody style={styles.emptyText}>No trips yet</TextBody>
        ) : (
          <div style={styles.tripsGrid}>
            {trips.map(({ node }) => (
              <div key={node.id} style={styles.tripCard}>
                <div style={styles.tripMapPlaceholder}>
                  <span style={styles.tripMapIcon}>🗺️</span>
                </div>
                <div style={styles.tripInfo}>
                  <TextBody style={styles.tripName}>{node.name}</TextBody>
                  {node.start_date && (
                    <TextBody style={styles.tripDate}>
                      {new Date(node.start_date).toLocaleDateString()}
                    </TextBody>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Trip Modal */}
      {showNewTripModal && (
        <div style={styles.modalOverlay} onClick={() => setShowNewTripModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <TextTitle3>New Trip</TextTitle3>
              <button
                onClick={() => setShowNewTripModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTrip} style={styles.modalContent}>
              <label style={styles.label}>
                <TextBody>Trip Name</TextBody>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Enter trip name"
                  style={styles.input}
                  autoFocus
                />
              </label>
              <Button
                type="submit"
                variant="primary"
                disabled={!tripName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Trip"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  if (!username) {
    return (
      <div style={styles.container}>
        <TextBody>Invalid profile URL</TextBody>
      </div>
    );
  }

  return (
    <RelayProvider>
      <ProfileContent username={username} />
    </RelayProvider>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "48px 24px",
    borderBottom: "1px solid #eee",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: "cover" as const,
  },
  avatarPlaceholder: {
    backgroundColor: "#e0e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bio: {
    color: "#666",
    textAlign: "center" as const,
    maxWidth: 400,
  },
  actions: {
    marginTop: 16,
  },
  tripsSection: {
    padding: 24,
    maxWidth: 1200,
    margin: "0 auto",
  },
  sectionTitle: {
    marginBottom: 24,
  },
  emptyText: {
    color: "#666",
    textAlign: "center" as const,
    padding: 40,
  },
  tripsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
  },
  tripCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  tripMapPlaceholder: {
    height: 150,
    backgroundColor: "#e0e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tripMapIcon: {
    fontSize: 48,
  },
  tripInfo: {
    padding: 16,
  },
  tripName: {
    fontWeight: 600,
    marginBottom: 4,
  },
  tripDate: {
    color: "#666",
    fontSize: 14,
  },
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottom: "1px solid #eee",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    color: "#666",
  },
  modalContent: {
    padding: 24,
  },
  label: {
    display: "block",
    marginBottom: 16,
  },
  input: {
    display: "block",
    width: "100%",
    padding: 12,
    marginTop: 8,
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 16,
    boxSizing: "border-box" as const,
  },
} as const;
