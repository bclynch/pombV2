import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box, HStack } from "@coinbase/cds-mobile/layout";
import { TextTitle2 } from "@coinbase/cds-mobile/typography/TextTitle2";
import { AvatarButton } from "@coinbase/cds-mobile/buttons/AvatarButton";
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
import { useAuth } from "@/lib/AuthContext";
import { MainStackParamList, RootStackParamList } from "@/navigation/types";

type MainNavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function AppHeader() {
  const mainNavigation = useNavigation<MainNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const { session, profile } = useAuth();

  const handleLogoPress = () => {
    mainNavigation.navigate("Home");
  };

  const handleProfilePress = () => {
    if (session && profile?.username) {
      mainNavigation.navigate("Profile", { username: profile.username });
    } else {
      rootNavigation.navigate("Auth");
    }
  };

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      paddingX={2}
      paddingY={1.5}
      background="bg"
      borderedBottom
    >
      <Pressable onPress={handleLogoPress}>
        <TextTitle2 fontWeight="title1">POMB</TextTitle2>
      </Pressable>

      <AvatarButton
        onPress={handleProfilePress}
        src={profile?.avatar_url ?? undefined}
        name={profile?.username ?? undefined}
        compact
      />
    </HStack>
  );
}
