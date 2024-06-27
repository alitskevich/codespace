import { Component } from "arrmatura-web";
// import { TArrmatron } from "arrmatura-web";
// import { getAnalytics } from "firebase/analytics";
import { FirebaseApp } from "firebase/app";
import {
  Firestore,
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

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

export class FirestoreService extends Component {
  #firestore?: Firestore;
  app?: { instance: FirebaseApp };

  __init() {
    if (this.app?.instance) {
      this.#firestore = getFirestore(this.app?.instance);
      connectFirestoreEmulator(this.#firestore, "127.0.0.1", 8888);
    }
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
  }

  get firestore(): Firestore {
    if (!this.#firestore) {
      throw new Error("auth is not initialized");
    }
    return this.#firestore;
  }

  getCollection(path: string, since: number) {
    const coll = collection(this.firestore, path);
    return query(coll, where("ts", ">", since)); //.withConverter(unpackDoc);
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

  nextId(coll) {
    return doc(collection(this.firestore, coll)).id;
  }

  getDoc(coll, id) {
    return getDoc(doc(collection(this.firestore, coll), id)).then((d) => d.data());
  }

  writeBatch(delta) {
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
    return batch.commit();
  }

  // fasade for DataApiService
  async invokeApi({ body: { action = "realtime.downstream", data } }) {
    if (action === "realtime.downstream") {
      return this.getCollection("items", 0);
    } else if (action === "realtime.upstream") {
      return this.writeBatch(data);
    } else if (action === "realtime.loadItem") {
      const { store, id } = data;
      const item = await this.getDoc(store, id);
      return { item };
    } else if (action === "realtime.upsertItem") {
      await this.writeBatch({ items: [data] });
      return { item: data };
    }

    return {};
  }
}
