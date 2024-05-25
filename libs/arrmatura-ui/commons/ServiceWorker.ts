import { Component } from "arrmatura";
import { assert, Delta } from "ultimus";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
export class ServiceWorker extends Component {
  source = "/service-worker.js";
  scope = "/";

  get api() {
    return navigator.serviceWorker;
  }

  init() {
    try {
      assert(this.api, "Service Workers are not supported");

      const { source, scope, push } = this;

      void this.api
        .register(source, { scope })
        .then((registration) => this.registered(registration))
        .then(() => this.api.ready.then(() => this.log("Service Worker Ready")));

      this.api.addEventListener("message", (ev: any) => this.onMessage(ev));

      if (push) {
        this.subscribe();
      }
    } catch (error: any) {
      this.fallback(error);
    }
    return null;
  }

  fallback(error: Error) {
    this.log(error);
  }

  // hook on registered
  registered(registration: unknown) {
    this.log("Service Worker Registered");
    return registration;
  }
  /**
   * Push
   */

  unsubscribe() {
    this.api.ready
      .then(({ pushManager }) => pushManager.getSubscription())
      .then((ss) => ss?.unsubscribe())
      .then(() => this.saveSubscription())
      .catch(function (e) {
        console.log("Error thrown while unsubscribing from  push messaging.", e);
      });
  }

  subscribe() {
    if (Notification.permission === "granted") {
      /* do our magic */
    } else {
      /* show a prompt to the user */
    }
    const applicationServerKey = urlBase64ToUint8Array(this.vapidPublicKey as string);
    void this.api.ready.then(({ pushManager }) =>
      pushManager
        .getSubscription()
        // .then((ss) => ss && ss.unsubscribe())
        .then(
          (ss: any) =>
            ss ??
            pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey,
            })
        )
        .then((subscription: any) => this.saveSubscription(subscription.toJSON()))
        .catch((err: any) => {
          if (Notification.permission === "denied") {
            this.log("The user has blocked notifications.");
          }
          this.logError(err);
        })
    );
  }

  // to be overriden from props
  saveSubscription(ss?: any) {
    this.subscription = ss;
  }

  /**
   * Intercommunication between service worker.
   */

  // handles a message posted from Service worker.
  onMessage(payload: Delta) {
    this.log("onMessage", payload);
  }
}
