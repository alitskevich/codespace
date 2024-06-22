import { Component } from "arrmatura";
import { TArrmatron } from "arrmatura/types";
import { Hash } from "ultimus";

type User = Hash;
type Doc = Hash;
type Coll = Hash;
type DocGet = { id: string; data: () => Doc };

const unpackDocs = (s: { docs: DocGet[] }) =>
  s.docs.reduce((r: Doc[], e) => {
    const d = e.data();
    d.id = e.id;
    r.push(d);
    return r;
  }, []);

const firebase =
  "firebase" in window
    ? window.firebase
    : ({
        app: () => {},
        auth: () => {},
        firestore: () => {},
        initializeApp: () => {},
      } as any);

export class FirebaseService extends Component {
  firestore: any;
  auth: any;
  providers: { Google: any };

  constructor({ ...config }, ctx: TArrmatron) {
    super(config, ctx);

    firebase.initializeApp(config);

    this.firestore = firebase.firestore();
    this.firestore.enablePersistence({ synchronizeTabs: true }).catch(function (err: any) {
      if (err.code === "failed-precondition") {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a time.
        // ...
      } else if (err.code === "unimplemented") {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });

    this.auth = firebase.auth();
    this.auth.languageCode = "by";
    this.providers = {
      Google: firebase.auth.GoogleAuthProvider,
    };
  }

  __init() {
    firebase.listenUser((user: User) => {
      if (!user) {
        firebase.signInAnonymously();
        // User is signed out.
        // ...
      }
      this.touch();
    });
    this.defer(() => {
      firebase.listenUser(null);
      firebase.app().delete();
    });
  }

  // auth

  signInAnonymously() {
    this.auth.signInAnonymously().catch((error: Error) => {
      this.logError(error);
    });
  }

  listenUser(cb: () => void) {
    this.auth.onAuthStateChanged(cb);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  linkProvider() {
    const provider = new this.providers.Google();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    return this.auth
      .signInWithPopup(provider)
      .then((result: Hash) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken
        // The signed-in user info.
        const googleUser = result.user;
        const credential = this.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token
        );
        this.getCurrentUser()
          .linkAndRetrieveDataWithCredential(credential)
          .then(
            function (usercred: Hash) {
              const user = usercred.user;
              console.log("Anonymous account successfully upgraded", user);
            },
            function (error: Error) {
              console.log("Error upgrading anonymous account", error);
            }
          );
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
    const user = firebase.getCurrentUser();
    if (user !== null) {
      user.providerData.forEach(function (_profile: Hash) {
        // console.log('Sign-in provider: ' + profile.providerId)
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

  doLogin() {
    return firebase.linkProvider();
  }

  doLogout() {
    // return this.signInAnonymously()
    return firebase.logout();
  }

  // firestore

  getCollection(coll: Coll, since: number) {
    return ((c) => (since ? c.where("modified_at", ">", since) : c))(
      this.firestore.collection(coll)
    )
      .get()
      .then(unpackDocs);
  }

  listenCollection(coll, ts = 0, cb) {
    return ((c) => (ts ? c.where("modified_at", ">", ts) : c))(
      this.firestore.collection(coll)
    ).onSnapshot(function (querySnapshot) {
      const r: any[] = [];
      querySnapshot.forEach(function (e) {
        const d = e.data();
        d.id = e.id;
        r.push(d);
      });
      cb(null, { [coll]: r });
    });
  }

  nextId(coll) {
    return this.firestore.collection(coll).doc().id;
  }

  update(delta) {
    const now = Date.now().valueOf();
    // Get a new write batch
    const batch = this.firestore.batch();
    Object.keys(delta).forEach((coll) => {
      const c = this.firestore.collection(coll);
      delta[coll].forEach((d) => {
        d.modified_at = now;
        if (!d.created_at) {
          d.created_at = now;
        }
        const ref = c.doc(`${d.id}`);
        batch.set(ref, d, { merge: true });
      });
    });
    return batch.commit();
  }

  // realtime fasade for IndexedDbService
  invokeApi({ action }) {
    if (action === "realtime.downstream") {
      return this.update({});
    } else if (action === "realtime.upstream") {
      return this.update({});
    } else if (action === "realtime.upsetItem") {
      return this.update({});
    }

    return {};
  }
}

const hot = typeof module === "undefined" ? null : (module as unknown as Hash).hot;
if (hot) {
  // hot.addStatusHandler(function (d) {})
  hot.accept();
}
