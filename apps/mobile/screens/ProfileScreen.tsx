import { useState } from "react";
import { ScrollView, Alert, Modal as RNModal } from "react-native";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextTitle1 } from "@coinbase/cds-mobile/typography/TextTitle1";
import { TextTitle3 } from "@coinbase/cds-mobile/typography/TextTitle3";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { TextLabel2 } from "@coinbase/cds-mobile/typography/TextLabel2";
import { Box, VStack, HStack } from "@coinbase/cds-mobile/layout";
import { Avatar } from "@coinbase/cds-mobile/media/Avatar";
import { TextInput } from "@coinbase/cds-mobile/controls/TextInput";
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
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
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
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

  const handleCreateTrip = () => {
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
        setFetchKey((k) => k + 1);
        Alert.alert("Success", "Trip created successfully!");
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    });
  };

  if (!profile) {
    return (
      <Box flexGrow={1} background="bg">
        <AppHeader />
        <Box flexGrow={1} justifyContent="center" alignItems="center">
          <TextBody>User not found</TextBody>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexGrow={1} background="bg">
      <AppHeader />
        <ScrollView>
          {/* Profile Header */}
          <VStack alignItems="center" padding={3} gap={3} borderedBottom>
            {isOwner ? (
              <AvatarUpload
                userId={profile.id}
                currentAvatarUrl={avatarUrl ?? profile.avatar_url ?? null}
                username={profile.username ?? null}
                onUploadComplete={setAvatarUrl}
              />
            ) : (
              <Avatar
                src={avatarUrl ?? profile.avatar_url ?? undefined}
                name={profile.username ?? undefined}
                size="xxxl"
              />
            )}
            <VStack alignItems="center" gap={2}>
              <TextTitle1>{profile.username}</TextTitle1>
              {profile.bio && (
                <TextBody color="fgMuted" textAlign="center">
                  {profile.bio}
                </TextBody>
              )}
            </VStack>
            {isOwner && (
              <HStack gap={2}>
                <Button variant="primary" onPress={() => setShowNewTripModal(true)}>
                  New Trip
                </Button>
              </HStack>
            )}
          </VStack>

          {/* Trips Section */}
          <Box padding={2}>
            <VStack gap={3}>
              <TextTitle3>Trips</TextTitle3>
              {trips.length === 0 ? (
                <Box padding={3} alignItems="center">
                  <TextBody color="fgMuted">No trips yet</TextBody>
                </Box>
              ) : (
                <HStack gap={2} flexWrap="wrap">
                  {trips.map(({ node }) => (
                    <Pressable
                      key={node.id}
                      style={{ width: "48%" }}
                      onPress={() => {
                        if (node.slug) {
                          navigation.navigate("Trip", { username, tripSlug: node.slug });
                        }
                      }}
                    >
                      <Box background="bgAlternate" borderRadius={200} overflow="hidden">
                        <Box
                          height={100}
                          background="bgTertiary"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <TextBody>🗺️</TextBody>
                        </Box>
                        <VStack padding={1} gap={0.5}>
                          <TextBody fontWeight="headline" numberOfLines={1}>
                            {node.name}
                          </TextBody>
                          {node.start_date && (
                            <TextLabel2 color="fgMuted">
                              {new Date(node.start_date).toLocaleDateString()}
                            </TextLabel2>
                          )}
                        </VStack>
                      </Box>
                    </Pressable>
                  ))}
                </HStack>
              )}
            </VStack>
          </Box>
        </ScrollView>

        {/* New Trip Modal */}
        <RNModal
          visible={showNewTripModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowNewTripModal(false)}
        >
          <Box flexGrow={1} background="bg">
            <HStack
              justifyContent="space-between"
              alignItems="center"
              padding={2}
              borderedBottom
            >
              <TextTitle3>New Trip</TextTitle3>
              <Pressable onPress={() => setShowNewTripModal(false)}>
                <TextBody>Cancel</TextBody>
              </Pressable>
            </HStack>
            <Box padding={2}>
              <VStack gap={2}>
                <TextInput
                  label="Trip Name"
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
              </VStack>
            </Box>
          </Box>
        </RNModal>
    </Box>
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
