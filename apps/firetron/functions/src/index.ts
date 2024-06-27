import { initializeApp } from "firebase-admin";
import * as functions from "firebase-functions";

const app = initializeApp();

const db = app.firestore();

async function setItem({ id, ...data }) {
  const docRef = db.collection("items").doc(id);
  await docRef.set(data);
}

async function getItems() {
  const result: any[] = [];

  const snapshot = await db.collection("items").get();

  snapshot.forEach((doc: any) => {
    console.log(doc.id, "=>", doc.data());
    result.push(doc.data());
  });

  return result;
}

export const api = functions.https.onRequest(async (request, response) => {
  const method = request.method.toUpperCase();
  functions.logger.info(`API:${method}`, request.body);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Method", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");

  if (method === "OPTIONS") {
    // response.setHeader("Content-Type", "application/json");

    response.status(200).send("");
    return;
  }

  // if (method !== "POST") {
  //   response.status(400).send("Bad request");
  //   return;
  // }

  const { id, ...data } = request.body;
  if (!id) {
    const items = await getItems();
    response.send(items.concat(data));
    return;
  }

  const items = setItem({ id, ...data });
  response.setHeader("Content-Type", "application/json");

  response.send(items);
});
