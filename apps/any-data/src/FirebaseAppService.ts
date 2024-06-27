import { Component } from "arrmatura-web";
import { initializeApp } from "firebase/app";

export class FirebaseAppService extends Component {
  constructor({ ...config }, ctx: any) {
    super(config, ctx);

    this.instance = initializeApp(config);
  }
}
