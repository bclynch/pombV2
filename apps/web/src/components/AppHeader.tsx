import { useNavigate } from "react-router-dom";
import { TextTitle2 } from "@coinbase/cds-web/typography";
import { Box } from "@coinbase/cds-web/layout";
import { AvatarButton } from "@coinbase/cds-web/buttons";
import { Pressable } from "@coinbase/cds-web/system";
import { useAuth } from "../lib/AuthContext";

export function AppHeader() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    if (session && profile?.username) {
      navigate(`/${profile.username}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      as="header"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingY={1.5}
      paddingX={3}
      background="bg"
      borderedBottom
    >
      <Pressable onClick={handleLogoClick}>
        <TextTitle2 fontWeight="title1">POMB</TextTitle2>
      </Pressable>

      <AvatarButton
        onClick={handleProfileClick}
        src={profile?.avatar_url ?? undefined}
        name={profile?.username ?? undefined}
        compact
      />
    </Box>
  );
}
