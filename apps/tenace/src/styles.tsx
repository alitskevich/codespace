import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9FAFA",
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: "100%",
  },
  webView: {
    // Hack for fix android crash https://github.com/react-native-webview/react-native-webview/issues/1915
    opacity: 0.99,
  },
  webViewContainer: {
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 20,
  },
});
