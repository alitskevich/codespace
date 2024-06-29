import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { ErrorScreen } from "./ErrorScreen";
import { ResetAppButton } from "./ResetAppButton";
import { WEB_BASE_URL } from "./consts";
import { styles } from "./styles";
import { useWebViewErrorHandler } from "./useWebViewErrorHandler";

/*
 * Hybrid screen.
 */
export const HybridScreen: React.FC = React.memo(() => {
  // const {
  //   webViewRef,
  //   onMessage,
  //   onShouldStartLoadWithRequest,
  //   onNavigationStateChange,
  //   isQRRequested,
  //   isAttachmentRequested,
  //   onQRScan,
  //   lang,
  // } = useHybridViewManager();

  const { error, errorHanders } = useWebViewErrorHandler();
  if (error) {
    return (
      <ErrorScreen message={error}>
        <ResetAppButton />
      </ErrorScreen>
    );
  }
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingContainer}>
        <WebView
          // ref={webViewRef as LegacyRef<WebView>}
          // userAgent={USER_AGENT}
          source={{ uri: WEB_BASE_URL }}
          // hooks:
          // onMessage={onMessage}
          // onLoad={onLoad}
          // onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          {...errorHanders}
          // appearance:
          style={[styles.webView]}
          startInLoadingState
          // containerStyle={styles.webViewContainer}
          scrollEnabled
          bounces={false}
          // permissions:
          allowsInlineMediaPlayback
          geolocationEnabled
          allowFileAccess
          mediaPlaybackRequiresUserAction={false}
          keyboardDisplayRequiresUserAction={false}
          mediaCapturePermissionGrantType="grant"
          // onNavigationStateChange={onNavigationStateChange}
          hideKeyboardAccessoryView
        />
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});
