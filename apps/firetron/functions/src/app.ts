import { initializeApp } from "firebase-admin";

const app = initializeApp();

const db = app.firestore();

const auth = app.auth();

const unpackDoc = (d) => (d ? { ...d.data(), id: d.id } : {});

const user = (uid) => auth.getUser(uid);

export const coll = (path) =>
  typeof path === "string"
    ? path.slice(0, 6) === "group:"
      ? db.collectionGroup(path.slice(6))
      : db.collection(path)
    : path;

export const doc = (path) => (typeof path === "string" ? db.doc(path) : path);

export const docGet = async (path, full) => {
  const ref = doc(path);
  const d = await ref.get();
  const result = unpackDoc(d);
  if (full) {
    const collections = await ref.listCollections();
    await Promise.all(
      collections.map(async (collection) => {
        const enabled = Array.isArray(full) ? full.includes(collection.id) : true;
        if (enabled) {
          result[collection.id] = await collectionGet(collection);
        }
      })
    );
  }
  return result;
};

export const docUpdate = (path, data = {}) =>
  doc(path).set({ ...data, touch: Date.now() }, { merge: true });

export const eachDoc = (path, fn = unpackDoc) =>
  coll(path)
    .get()
    .then((snap) => {
      const results = [];
      snap.forEach((d) => {
        const r = fn(d);
        if (r) {
          results.push(r);
        }
      });
      return Promise.all(results);
    });

export const query = (path, cond, fn = unpackDoc) => {
  return coll(path)
    .where(...cond)
    .get()
    .then((snap) => {
      const results = [];
      snap.forEach((d) => results.push(fn(d)));
      return results;
    });
};

export const collectionGet = (path, cond = null) =>
  (cond ? coll(path).where(...cond) : coll(path)).get().then((snap) => {
    const results = [];
    snap.forEach((d) => {
      const data = unpackDoc(d);
      if (!data.deleted) {
        results.push(data);
      }
    });
    return results;
  });

export const batchUpdate = (delta: any) => {
  const batch = db.batch();
  Object.entries(delta).forEach(([path, list]: any) => {
    const c = coll(path);
    list.forEach((d) => {
      console.log("update", path, d.id, d);
      const delta = { ...d, touch: Date.now() };
      if (d.id) {
        const ref = db.doc(`${path}/${d.id}`);
        delete d.id;
        batch.set(ref, delta, { merge: true });
      } else {
        batch.set(c.doc(), delta);
      }
    });
  });
  return batch.commit();
};

export const readUser = async (uid, full) => {
  const { customClaims: { key } = {} } = await user(uid);
  const data = await docGet(`users/${uid}`, full);
  return { uid, ...data, key };
};

export const writeUser = async (uid, data) => {
  let { customClaims: { key } = {} } = await user(uid);
  if (!key) {
    key = "123";
    await auth.setCustomUserClaims(uid, { key });
    console.log("key added", key);
  }
  // const pdata = await app.docGet(`users/${uid}`);
  // const prev = pdata._ && key ? JSON.parse(crypto.decrypt(pdata._, key)) : {}
  // await app.docUpdate(`users/${uid}`, {
  //     _: crypto.encrypt(JSON.stringify({ ...prev, ...data }), key),
  // })
  await docUpdate(`users/${uid}`, data);
  return { uid };
};

export const rbac = async (uid, role = "admin") => {
  if (!uid) return { error: "Not logged in." };

  const user = await readUser(uid, ["rbac"]);
  if (!user) return { error: `User is not found: ${uid}` };
  // const rbac = (user.rbac || []).find(e => ((e.role || '').includes(role)))
  if (role === "admin") {
    return !user.adminFor
      ? { error: `No admin role assignment for ${uid}` }
      : { user, target: `clinics/${user.adminFor}` };
  }
  if (role === "superadmin") {
    return !user.isSuperAdmin ? { error: `No superadmin role assignment for ${uid}` } : { user };
  }
  return { error: `Unknown role: ${role}` };
};
