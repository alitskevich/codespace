import { SafeAreaProvider } from "react-native-safe-area-context";

import { HybridScreen } from "./src/HybridScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <HybridScreen />
    </SafeAreaProvider>
  );
}
