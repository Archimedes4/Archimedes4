import { addDoc, collection, getDocs, getFirestore, orderBy, query, serverTimestamp } from "firebase/firestore";
import { app } from "../app/_layout"
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

export async function listMessages(): Promise<{result: loadingStateEnum.success, data: message[]}|{result: loadingStateEnum.failed}> {
  //TODO error handel paginate
  try {
    const db = getFirestore();
    let resultData: message[] = []
    const q = query(collection(db, "Messages"), orderBy('time'));
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
  } catch {
    return {result: loadingStateEnum.failed}
  }
}