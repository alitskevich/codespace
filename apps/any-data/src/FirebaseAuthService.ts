import { Component } from "arrmatura-web";
// import { TArrmatron } from "arrmatura-web";
// import { getAnalytics } from "firebase/analytics";
import { FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  Auth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { Hash } from "ultimus";

// type Doc = Hash;
// type DocGet = { id: string; data: () => Doc };

// const unpackDocs = (s: { docs: DocGet[] }) =>
//   s.docs.reduce((r: Doc[], e) => {
//     const d = e.data();
//     d.id = e.id;
//     r.push(d);
//     return r;
//   }, []);

// Initialize Firebase
// const analytics = getAnalytics(app);

export class FirebaseAuthService extends Component {
  _auth?: Auth;
  app?: { instance: FirebaseApp };
  constructor({ ...config }, ctx: any) {
    super(config, ctx);
  }

  __init() {
    this._auth = getAuth(this.app?.instance);
    // this.auth.languageCode = "by";

    connectAuthEmulator(this.auth, "http://localhost:9099");
    // this.providers = {
    //   Google: app.options.GoogleAuthProvider,
    // };

    this.defer(
      onAuthStateChanged(this.auth, (user) => {
        if (!user) {
          // this.auth..signInAnonymously();
          // User is signed out.
          // ...
        }
        this.touch();
      })
    );

    this.defer(() => {
      // this.auth.listenUser(null);
      // this.auth.app().delete();
    });
  }

  get auth(): Auth {
    if (!this._auth) {
      throw new Error("auth is not initialized");
    }
    return this._auth;
  }

  signInAnonymously() {
    // this.auth.signInAnonymously().catch((error: Error) => {
    //   this.logError(error);
    // });
  }

  listenUser(cb: () => void) {
    this.auth.onAuthStateChanged(cb);
  }

  async invoke() {
    return this.currentUser;
  }

  get isAuthorized() {
    return !!this.auth.currentUser;
  }

  get currentUser() {
    return this.auth.currentUser ?? null;
  }

  signIn() {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    return signInWithPopup(this.auth, provider)
      .then((_result: Hash) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken
        // The signed-in user info.
        // const googleUser = result.user;
        // const credential = GoogleAuthProvider.credential(
        //   googleUser.getAuthResponse().id_token
        // );
        // linkAndRetrieveDataWithCredential(credential)
        //   .then(
        //     function (usercred: Hash) {
        //       const user = usercred.user;
        //       console.log("Anonymous account successfully upgraded", user);
        //     },
        //     function (error: Error) {
        //       console.log("Error upgrading anonymous account", error);
        //     }
        //   );
        // ...
      })
      .catch(function (error: Error) {
        // Handle Errors here.
        // var errorCode = error.code
        const errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential
        console.log(`signInAnonymously err=${errorMessage}`);
        // ...
      });
  }

  getUserInfo() {
    const user = this.currentUser;
    if (user != null) {
      user.providerData.forEach(function (profile: Hash) {
        console.log(`Sign-in provider: ${profile.providerId}`);
        // console.log('  Provider-specific UID: ' + profile.uid)
        // console.log('  Name: ' + profile.displayName)
        // console.log('  Email: ' + profile.email)
        // console.log('  Photo URL: ' + profile.photoURL)
      });
    }
    return !user
      ? { isLoading: true }
      : {
          ...user,
          isLoading: false,
        };
  }

  signOut() {
    // return this.signInAnonymously()
    return this.auth.signOut();
  }
  // firestore
}
