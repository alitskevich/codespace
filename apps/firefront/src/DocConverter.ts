import { QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export const DocConverter = {
  toFirestore(value: WithFieldValue<any>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    data.id = snapshot.id;
    return data;
  },
};
