import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, MediaQueryProvider } from "@coinbase/cds-web/system";
import { defaultTheme } from "@coinbase/cds-web/themes/defaultTheme";
import { AuthProvider } from "./lib/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <MediaQueryProvider>
        <ThemeProvider theme={defaultTheme} activeColorScheme="light">
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </MediaQueryProvider>
    </BrowserRouter>
  );
}

export default App;
