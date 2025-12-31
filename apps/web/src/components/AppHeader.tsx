import { useNavigate } from "react-router-dom";
import { TextTitle2, TextTitle3 } from "@coinbase/cds-web/typography";
import { useAuth } from "../lib/AuthContext";

export function AppHeader() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    if (session && profile?.username) {
      navigate(`/profile/${profile.username}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <header style={styles.container}>
      <button onClick={handleLogoClick} style={styles.logoButton}>
        <TextTitle2 style={styles.logo}>POMB</TextTitle2>
      </button>

      <button onClick={handleProfileClick} style={styles.profileButton}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" style={styles.avatar} />
        ) : (
          <div style={styles.avatarPlaceholder}>
            <TextTitle3 style={styles.avatarText}>
              {profile?.username?.charAt(0).toUpperCase() ?? "?"}
            </TextTitle3>
          </div>
        )}
      </button>
    </header>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
  },
  logoButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
  logo: {
    fontWeight: 700,
  },
  profileButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    objectFit: "cover" as const,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 600,
  },
} as const;
