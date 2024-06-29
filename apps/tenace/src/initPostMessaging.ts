import { MutableRefObject } from 'react';
import WebView from 'react-native-webview';

import { Log } from 'services/logging';
import { PostMessage } from 'types';

const WEB_VIEW_REF: { current: WebView | undefined } = {
  current: undefined,
};

const deferred = new Set<PostMessage>();

function postDatagram(webView: WebView, message: PostMessage) {
  try {
    Log.info(`>>>`, message.action);
    // webView.postMessage(message);
    webView.injectJavaScript(
      `window.postMessage(${JSON.stringify(message)}, window.origin)`,
    );
  } catch (e) {
    Log.error('>>>', e);
  }
}

export const initPostMessaging = ({ current }: MutableRefObject<WebView>) => {
  WEB_VIEW_REF.current = current;

  if (current) {
    deferred.forEach(datagram => postDatagram(current, datagram));
    deferred.clear();
  }
};

/**
 * Posts a message into current WebView instance.
 * @param message a raw message
 */
export const postMessage = (message: PostMessage): void => {
  if (!WEB_VIEW_REF.current) {
    deferred.add(message);
  } else {
    postDatagram(WEB_VIEW_REF.current, message);
  }
};
