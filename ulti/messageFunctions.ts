import { addDoc, collection, getDocs, getFirestore, orderBy, query, serverTimestamp } from "firebase/firestore";
import { app } from "../App";
import { loadingStateEnum } from "../Types";

export async function sendMessage(email: string, content: string): Promise<loadingStateEnum> {
  const db = getFirestore(app);
  try {
    await addDoc(collection(db, 'Messages'), {
      email: email,
      time: serverTimestamp(),
      content: content
    })
    return loadingStateEnum.success;
  } catch {
    return loadingStateEnum.failed;
  }
}

export async function listMessages() {
  const db = getFirestore();
  //TODO error handel paginate
  let resultData: message[] = []
  const q = query(collection(db, "Files"), orderBy('time'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    resultData.push({
      email: data.email,
      content: data.content,
      time: data.time.toDate().toISOString()
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}