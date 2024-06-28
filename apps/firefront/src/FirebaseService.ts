import { Component } from "arrmatura-web";
import { initializeApp } from "firebase/app";
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
import {
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { Hash } from "ultimus";

const DocConverter = {
  toFirestore(value: WithFieldValue<any>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    data.id = snapshot.id;
    return data;
  },
};
export class FirebaseService extends Component {
  firestore: Firestore;
  app: FirebaseApp;
  auth: Auth;
  constructor({ ...config }, ctx: any) {
    super(config, ctx);

    this.app = initializeApp(config);
    this.firestore = getFirestore(this.app);
    connectFirestoreEmulator(this.firestore, "127.0.0.1", 8888);

    // this.firestore..enablePersistence({ synchronizeTabs: true }).catch(function (err: any) {
    //   if (err.code === "failed-precondition") {
    //     // Multiple tabs open, persistence can only be enabled
    //     // in one tab at a time.
    //     // ...
    //   } else if (err.code === "unimplemented") {
    //     // The current browser does not support all of the
    //     // features required to enable persistence
    //     // ...
    //   }
    // });

    this.auth = getAuth(this.app);
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

  signInAnonymously() {
    // this.auth.signInAnonymously().catch((error: Error) => {
    //   this.logError(error);
    // });
  }

  listenUser(cb: () => void) {
    this.auth.onAuthStateChanged(cb);
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

  query(path: string, field, val: any) {
    const ref = collection(this.firestore, path).withConverter(DocConverter);
    const coll = field ? query(ref, where(field, "==", val)) : query(ref); //.withConverter(unpackDoc);
    return new Promise((resolve, reject) => {
      getDocs(coll)
        .then((snapshot) => {
          const result: any[] = [];
          snapshot.forEach((e) => {
            const d = e.data();
            d.id = e.id;
            result.push(d);
          });
          resolve(result);
        })
        .catch(reject);
    });
  }

  listenCollection(path, ts = 0, cb) {
    const coll = collection(this.firestore, path);

    return onSnapshot(query(coll, where("ts", ">", ts)), function (querySnapshot) {
      const r: any[] = [];
      querySnapshot.forEach(function (e) {
        const d = e.data();
        d.id = e.id;
        r.push(d);
      });
      cb(null, { [path]: r });
    });
  }

  getDoc(coll, id) {
    return getDoc(doc(collection(this.firestore, coll), id)).then((d) => d.data());
  }

  async upsertItem({ $callback, store = "items", ...item }) {
    await this.writeBatch({ [store]: [item] });
    $callback?.({ item });
  }

  async loadItem({ $callback, store = "items", ...delta }) {
    const item = await this.getDoc(store, delta.id);
    $callback?.({ item });
  }

  async writeBatch(delta) {
    const now = Date.now().valueOf();
    // Get a new write batch
    const batch = writeBatch(this.firestore);
    Object.keys(delta).forEach((coll) => {
      const c = collection(this.firestore, coll);
      delta[coll].forEach((d) => {
        d.ts = now;
        if (!d.created_at) {
          d.created_at = now;
        }
        if (d.id) {
          const ref = doc(c, `${d.id}`);
          batch.update(ref, d, { merge: true });
        } else {
          const ref = doc(c);
          d.id = ref.id;
          batch.set(ref, d, { merge: true });
        }
      });
    });
    await batch.commit();
  }
}
