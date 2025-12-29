import { RelayProvider } from "./components/RelayProvider";
import { TripsList } from "./components/TripsList";
import { ThemeProvider, MediaQueryProvider } from "@coinbase/cds-web/system";
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';
import { Button } from "@coinbase/cds-web/buttons";

function App() {
  return (
    <MediaQueryProvider>
      <ThemeProvider theme={defaultTheme} activeColorScheme="light">
        <RelayProvider>
          <div style={{ padding: "16px" }}>
            <Button onClick={() => alert("CDS Works!")}>
              Test CDS Button
            </Button>
          </div>
          <TripsList />
        </RelayProvider>
      </ThemeProvider>
    </MediaQueryProvider>
  );
}

export default App;
