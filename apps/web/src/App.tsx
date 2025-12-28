import { RelayProvider } from "./components/RelayProvider";
import { TripsList } from "./components/TripsList";

function App() {
  return (
    <RelayProvider>
      <TripsList />
    </RelayProvider>
  );
}

export default App;
