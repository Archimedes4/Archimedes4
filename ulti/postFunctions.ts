import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from "../App";

export async function addPost(item: post) {
  const db = getFirestore(app);
  await addDoc(collection(db, 'Posts'), {
    title: item.title,
    cover: item.cover,
    data:  serverTimestamp(),
    content: item.content,
    type: 'Coding'
  })
  //TODO collection
}