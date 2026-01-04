import { useState, useCallback, type FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { Button } from "@coinbase/cds-web/buttons";
import { TextTitle1, TextTitle3, TextBody, TextLabel2 } from "@coinbase/cds-web/typography";
import { Box, HStack, VStack, Grid } from "@coinbase/cds-web/layout";
import { Avatar } from "@coinbase/cds-web/media";
import { Card } from "@coinbase/cds-web/cards";
import { Modal } from "@coinbase/cds-web/overlays";
import { TextInput } from "@coinbase/cds-web/controls";
import { RelayProvider } from "../components/RelayProvider";
import { AvatarUpload } from "../components/AvatarUpload";
import { useAuth } from "../lib/AuthContext";
import type { ProfileQueryWebQuery } from "../graphql/__generated__/ProfileQueryWebQuery.graphql";
import ProfileQueryNode from "../graphql/__generated__/ProfileQueryWebQuery.graphql";
import CreateTripMutationNode from "../graphql/__generated__/mutationsWebCreateTripMutation.graphql";

function ProfileContent({ username }: { username: string }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
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
          setFetchKey((k) => k + 1);
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
      <Box minHeight="100vh" background="bg" padding={6}>
        <TextBody>User not found</TextBody>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" width="100%" background="bg">
      {/* Profile Header */}
      <Box
        as="header"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        paddingY={6}
        paddingX={3}
        borderedBottom
      >
        <VStack gap={2} alignItems="center">
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
          <TextTitle1>{profile.username}</TextTitle1>
          {profile.bio && (
            <TextBody color="fgMuted" textAlign="center" maxWidth={400}>
              {profile.bio}
            </TextBody>
          )}
          {isOwner && (
            <HStack gap={3}>
              <Button variant="primary" onClick={() => setShowNewTripModal(true)}>
                New Trip
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                Log Out
              </Button>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Trips Grid */}
      <Box as="section" padding={3} width="100%" maxWidth={1200} style={{ marginLeft: "auto", marginRight: "auto" }}>
        <VStack gap={3}>
          <TextTitle3>Trips</TextTitle3>
          {trips.length === 0 ? (
            <Box padding={5} textAlign="center">
              <TextBody color="fgMuted">No trips yet</TextBody>
            </Box>
          ) : (
            <Grid columns={3} gap={3}>
              {trips.map(({ node }) => (
                <Link
                  key={node.id}
                  to={`/${username}/${node.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card size="large" background="bgAlternate">
                    <Box
                      height={150}
                      background="bgTertiary"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TextTitle1>🗺️</TextTitle1>
                    </Box>
                    <Box padding={2}>
                      <TextBody fontWeight="headline">{node.name}</TextBody>
                      {node.start_date && (
                        <TextLabel2 color="fgMuted">
                          {new Date(node.start_date).toLocaleDateString()}
                        </TextLabel2>
                      )}
                    </Box>
                  </Card>
                </Link>
              ))}
            </Grid>
          )}
        </VStack>
      </Box>

      {/* New Trip Modal */}
      <Modal
        visible={showNewTripModal}
        onRequestClose={() => setShowNewTripModal(false)}
      >
        <Box background="bg" borderRadius={300} width="100%" maxWidth={400} elevation={2}>
          <HStack justifyContent="space-between" alignItems="center" padding={3} borderedBottom>
            <TextTitle3>New Trip</TextTitle3>
            <Button variant="secondary" onClick={() => setShowNewTripModal(false)}>
              Cancel
            </Button>
          </HStack>
          <Box as="form" onSubmit={handleCreateTrip} padding={3}>
            <VStack gap={2}>
              <TextInput
                label="Trip Name"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Enter trip name"
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!tripName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Trip"}
              </Button>
            </VStack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  if (!username) {
    return (
      <Box minHeight="100vh" background="bg" padding={6}>
        <TextBody>Invalid profile URL</TextBody>
      </Box>
    );
  }

  return (
    <RelayProvider>
      <ProfileContent username={username} />
    </RelayProvider>
  );
}
