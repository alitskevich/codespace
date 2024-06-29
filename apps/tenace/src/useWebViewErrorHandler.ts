import { useCallback, useState } from "react";
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewRenderProcessGoneEvent,
  WebViewTerminatedEvent,
} from "react-native-webview/lib/WebViewTypes";

import { Log } from "./logging";

const DEFAULT_ERROR = "Error encountered while loading page";

export const useWebViewErrorHandler = () => {
  const [error, setError] = useState("");

  const onError = useCallback((event: WebViewErrorEvent) => {
    const { description = DEFAULT_ERROR } = event?.nativeEvent ?? event;
    Log.error("WEB", new Error(description));
    setError(description);
  }, []);

  const onHttpError = useCallback((event: WebViewHttpErrorEvent): void => {
    const { description = "Connectivity error" } = event?.nativeEvent ?? event;
    Log.error("WEB Http: ", description);
    setError(description);
  }, []);

  const onRenderProcessGone = useCallback(
    ({ nativeEvent }: WebViewRenderProcessGoneEvent): void => {
      Log.error("WEB RenderProcessGone: ", nativeEvent);
      setError("Render process gone");
    },
    []
  );

  const onContentProcessDidTerminate = useCallback(
    ({ nativeEvent }: WebViewTerminatedEvent): void => {
      Log.error("WEB ContentProcessDidTerminate: ", nativeEvent);
      setError("Content process did terminate");
    },
    []
  );

  return {
    error,
    errorHanders: {
      onError,
      onHttpError,
      onRenderProcessGone,
      onContentProcessDidTerminate,
    },
  };
};
