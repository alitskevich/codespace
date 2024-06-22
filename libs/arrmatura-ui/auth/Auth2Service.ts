import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";
import { Proc } from "ultimus";

import { ClientStorage } from "../support";

export class Auth2Service extends Component {
  authUrl = "";
  isAuthorized = false;
  isSignUpAllowed = false;
  isSignOutAllowed = true;
  $info: unknown;
  afterSignedOut?: Proc;
  persistence: PersistenceType = "session";
  local?: ClientStorage;

  __init() {
    return {
      busy: true,
      "...": fetch(`${this.authUrl}?action=ping`, {
        method: "GET",
        // mode: "cors",
        redirect: "error",
        credentials: "include",
        referrerPolicy: "no-referrer",
        cache: "no-cache",
        // body: "{}",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      })
        .then((res) => {
          if (res.status === 401) {
            // window.location.replace(`${this.authUrl}?action=signin`)
          } else {
            return {
              busy: false,
              isAuthorized: true,
            };
          }
        })
        .catch((_error: Error) => {
          // window.location.replace(`${this.authUrl}?action=signin`)
        }),
    };
  }
}
