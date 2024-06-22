// Telegram WebApp service

import { Component } from "arrmatura";
import { Delta } from "ultimus";

import { loadJson } from "../support/loadJson";

class TgWebAppStub {
  [key: string]: unknown;
  isMocked = true;
  initData = decodeURIComponent(
    "query_id=AAF53okTAAAAAHneiRM6K_rb&user=%7B%22id%22%3A327802489%2C%22first_name%22%3A%22Algard%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Arkebuk%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%7D&auth_date=1687600941&hash=e7b15340837412d1e3c51f3c15f7a0c4c3b241cc92022cb327165ef85aa081c8"
  );
  MainButton = {
    setParams() {
      return null;
    },
    showProgress() {
      return null;
    },
  };
  ready() {
    return null;
  }
  close() {
    return null;
  }
  expand() {
    return null;
  }
  onEvent() {
    return null;
  }
}

const tgWebApp = window["Telegram" as unknown as number]?.["WebApp" as unknown as number] as any;
// @see https://core.telegram.org/bots/webapps#initializing-web-apps
export class TgWebAppService extends Component {
  [key: string]: unknown;
  action?: (d: unknown) => void;
  submitQueryUrl?: string;
  data = {};
  app = tgWebApp.initData ? tgWebApp : new TgWebAppStub();
  get isMocked() {
    return this.app.isMocked ?? false;
  }

  get authDataString() {
    return this.app.initData;
  }

  __init() {
    this.app.ready();

    this.app.expand();

    this.app.MainButton.setParams({
      // color: '', //button color;
      // text_color: '', //button text color;
      is_active: true, //enable the button;
    });

    this.app.onEvent("mainButtonClicked", () => setTimeout(() => this.mainButtonClicked(), 10));
    this.defer(() => {
      this.app.MainButton.setParams({
        is_visible: false,
      });
    });
    return null;
  }

  async mainButtonClicked() {
    const action = this.action;
    try {
      this.log("mainButtonClicked", this.app, this.action);

      this.app.MainButton.showProgress();

      if (this.submitQueryUrl) {
        await this.submitQuery(this.data);
      }

      if (typeof action === "function") {
        await this.action?.(this.getSubmitPayloadMessage());
      } else if (action === "sendData") {
        await this.app.sendData(JSON.stringify(this.data));
      } else if (action === "switchInlineQuery") {
        this.app.switchInlineQuery(this.actionQuery || "");
      }
    } finally {
      this.app.MainButton.hideProgress();
    }
  }
  getSubmitPayloadMessage(data = {}) {
    return {
      auth_data_string: this.authDataString,
      web_app_query: { ...this.data, ...data },
    };
  }

  async submitQuery(data: any) {
    if (!this.submitQueryUrl) {
      this.toast(new Error("No submitUrl"));
      return;
    }

    const body = {
      message: this.getSubmitPayloadMessage(data),
    };

    return loadJson({
      url: this.submitQueryUrl,
      body,
      mode: "no-cors",
      headers: {
        // https://stackoverflow.com/questions/44910180/app-script-sends-405-response-when-trying-to-send-a-post-request
        "Content-Type": "text/plain;charset=utf-8",
      },
    })
      .then((r) => {
        this.app.close?.();
        return r;
      })
      .catch((error) => {
        this.toast(error);
      });

    // console.log(this.app.initData)
  }

  setButtonText(text: string) {
    this.app.MainButton.setParams({
      text: text, //button text;
      is_visible: !!text,
    });
  }

  onData(data: Delta) {
    return { data };
  }

  onSubmit(data: Delta) {
    return {
      busy: true,
      "...": this.submitQuery?.(data)
        .then(({ error } = {}) => {
          if (error) {
            throw error;
          }
          return { busy: false };
        })
        .catch((error) => {
          this.emit("toasters.send()", { message: `error:${error.message}` });
          return { busy: false };
        }),
    };
  }
}
