import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from "../App";

export async function sendMessages(email: string, content: string) {
  const db = getFirestore(app);
  await addDoc(collection(db, 'Messages'), {
    email: email,
    time: serverTimestamp(),
    content: content
  })
}

export async function listMessages() {

}