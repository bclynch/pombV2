import { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextTitle1 } from "@coinbase/cds-mobile/typography/TextTitle1";
import { TextTitle3 } from "@coinbase/cds-mobile/typography/TextTitle3";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { RelayProvider } from "@/components/RelayProvider";
import { AppHeader } from "@/components/AppHeader";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useAuth } from "@/lib/AuthContext";
import { MainStackParamList } from "@/navigation/types";
import type { ProfileQueryMobileQuery } from "@/graphql/__generated__/ProfileQueryMobileQuery.graphql";
import ProfileQueryNode from "@/graphql/__generated__/ProfileQueryMobileQuery.graphql";
import CreateTripMutationNode from "@/graphql/__generated__/mutationsCreateTripMutation.graphql";

type Props = NativeStackScreenProps<MainStackParamList, "Profile">;

function ProfileContent({ username }: { username: string }) {
  const { user } = useAuth();
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [tripName, setTripName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const data = useLazyLoadQuery<ProfileQueryMobileQuery>(
    ProfileQueryNode,
    { username },
    { fetchPolicy: "store-and-network", fetchKey }
  );

  const [commitCreateTrip, isCreating] = useMutation(CreateTripMutationNode);

  const profile = data.profilesCollection?.edges?.[0]?.node;
  const isOwner = user?.id === profile?.id;
  const trips = profile?.tripsCollection?.edges ?? [];

  const handleCreateTrip = useCallback(() => {
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
        Alert.alert("Success", "Trip created successfully!");
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    });
  }, [tripName, user?.id, commitCreateTrip]);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <AppHeader />
        <View style={styles.notFoundContainer}>
          <TextBody>User not found</TextBody>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader />
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {isOwner ? (
              <AvatarUpload
                userId={profile.id}
                currentAvatarUrl={avatarUrl ?? profile.avatar_url}
                username={profile.username}
                onUploadComplete={setAvatarUrl}
              />
            ) : (avatarUrl ?? profile.avatar_url) ? (
              <Image
                source={{ uri: avatarUrl ?? profile.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <TextTitle1>
                  {profile.username?.charAt(0).toUpperCase() ?? "?"}
                </TextTitle1>
              </View>
            )}
          </View>
          <TextTitle1>{profile.username}</TextTitle1>
          {profile.bio && (
            <TextBody style={styles.bio}>{profile.bio}</TextBody>
          )}
          {isOwner && (
            <View style={styles.actions}>
              <Button variant="primary" onPress={() => setShowNewTripModal(true)}>
                New Trip
              </Button>
            </View>
          )}
        </View>

        {/* Trips Grid */}
        <View style={styles.tripsSection}>
          <TextTitle3 style={styles.sectionTitle}>Trips</TextTitle3>
          {trips.length === 0 ? (
            <TextBody style={styles.emptyText}>No trips yet</TextBody>
          ) : (
            <View style={styles.tripsList}>
              {trips.map(({ node }) => (
                <TouchableOpacity key={node.id} style={styles.tripCard}>
                  <View style={styles.tripMapPlaceholder}>
                    <TextBody style={styles.tripMapIcon}>🗺️</TextBody>
                  </View>
                  <TextBody style={styles.tripName} numberOfLines={1}>
                    {node.name}
                  </TextBody>
                  {node.start_date && (
                    <TextBody style={styles.tripDate}>
                      {new Date(node.start_date).toLocaleDateString()}
                    </TextBody>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* New Trip Modal */}
      <Modal
        visible={showNewTripModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewTripModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TextTitle3>New Trip</TextTitle3>
            <TouchableOpacity onPress={() => setShowNewTripModal(false)}>
              <TextBody>Cancel</TextBody>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TextBody style={styles.label}>Trip Name</TextBody>
            <TextInput
              style={styles.input}
              value={tripName}
              onChangeText={setTripName}
              placeholder="Enter trip name"
              autoFocus
            />
            <Button
              variant="primary"
              onPress={handleCreateTrip}
              disabled={!tripName.trim() || isCreating}
            >
              {isCreating ? "Creating..." : "Create Trip"}
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export function ProfileScreen({ route }: Props) {
  const { username } = route.params;

  return (
    <RelayProvider>
      <ProfileContent username={username} />
    </RelayProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  bio: {
    marginTop: 8,
    color: "#666",
    textAlign: "center",
  },
  actions: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  tripsSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  tripsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tripCard: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  tripMapPlaceholder: {
    height: 100,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  tripMapIcon: {
    fontSize: 32,
  },
  tripName: {
    padding: 8,
    fontWeight: "600",
  },
  tripDate: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    color: "#666",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalContent: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
