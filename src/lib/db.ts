import { initializeApp } from "firebase/app";
import {
  addDoc,
  query as buildQuery,
  collection as getCollection,
  getDocs,
  getFirestore,
  limit as limitQuery,
  limitToLast as limitToLastQuery,
  orderBy as orderQuery,
  Timestamp,
  where as whereQuery,
  type CollectionReference,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbqLdQG5J3MhPbYtzjoxcRzb_5M_xwuMs",
  authDomain: "hobbies-db.firebaseapp.com",
  databaseURL: "https://hobbies-db.firebaseio.com",
  projectId: "hobbies-db",
  storageBucket: "hobbies-db.appspot.com",
  messagingSenderId: "568269658314",
  appId: "1:568269658314:web:7b1c25607c2ecc86",
};

export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

export const dbNow = () => Timestamp.now();

type Scalar = string | number | boolean | null | Timestamp;

export type WithId<T> = T & { id: string };

class Collection<T> {
  collec: CollectionReference<T>;

  constructor(readonly collecName: string) {
    this.collec = getCollection(
      firestore,
      collecName,
    ) as CollectionReference<T>;
  }

  async add(data: T) {
    return (await addDoc(this.collec, data)).id;
  }

  async get({
    limit,
    limitToLast,
    order,
    where,
  }: {
    limit?: number;
    limitToLast?: number;
    order?: Record<string, "asc" | "desc">;
    where?: Record<string, Scalar | [WhereFilterOp, Scalar]>;
  }) {
    const queries: QueryConstraint[] = [];

    if (limit != null) queries.push(limitQuery(limit));
    else if (limitToLast != null) queries.push(limitToLastQuery(limitToLast));

    if (order)
      for (const fieldPath in order) {
        const directionStr = order[fieldPath];
        queries.push(orderQuery(fieldPath, directionStr));
      }

    if (where)
      for (const fieldPath in where) {
        let op: WhereFilterOp = "==";
        let val = where[fieldPath];
        if (Array.isArray(val)) [op, val] = val;
        queries.push(whereQuery(fieldPath, op, val));
      }

    return (await getDocs(buildQuery(this.collec, ...queries))).docs.map(
      (d) => {
        const data = d.data();
        // @ts-expect-error just do it
        data.id = d.id;
        return data as WithId<T>;
      },
    );
  }
}
export type { Collection };

export const collection = <T>(collecName: string) =>
  new Collection<T>(collecName);
