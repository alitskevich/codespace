import { Proc } from "ultimus/types";
import { Component } from "arrmatura";
import { loadJson } from "../support";

export class ApiEndpoint extends Component {
  url = "/api";
  token = "";
  onUnauthorized?: Proc;

  invoke(data) {
    return loadJson(this.url, { ...data, token: this.token })
      .catch((error) => {
        if (error.code == 401) {
          this.onUnauthorized?.();
        }
        throw error;
      });
  }
}
