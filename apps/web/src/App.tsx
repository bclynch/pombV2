import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, MediaQueryProvider } from "@coinbase/cds-web/system";
import { defaultTheme } from "@coinbase/cds-web/themes/defaultTheme";
import { AuthProvider } from "./lib/AuthContext";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <MediaQueryProvider>
        <ThemeProvider theme={defaultTheme} activeColorScheme="light">
          <AuthProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
              </Routes>
            </AppLayout>
          </AuthProvider>
        </ThemeProvider>
      </MediaQueryProvider>
    </BrowserRouter>
  );
}

export default App;
