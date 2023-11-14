import { addDoc, collection, getDocs, getFirestore, orderBy, query, serverTimestamp } from "firebase/firestore";
import { app } from "../App";
import { loadingStateEnum } from "../Types";

export async function addTechnology(item: technology): Promise<loadingStateEnum> {
  const db = getFirestore(app);
  try {
    await addDoc(collection(db, 'Technologies'), {
      contact: item.content,
      name: item.name,
      displayTechnology: item.displayTechnology,
      firstUsed: serverTimestamp(),
      lastUsed: serverTimestamp(),
    })
    return loadingStateEnum.success;
  } catch {
    return loadingStateEnum.failed;
  }
}

export async function listTechnologies() {
  const db = getFirestore();
  //TODO error handel paginate
  let resultData: technology[] = []
  const q = query(collection(db, "Technologies"), orderBy('time'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    resultData.push({
      content: data.content,
      name: data.name,
      displayTechnology: data.displayTechnology,
      firstUsed: data.time.toDate().toISOString(),
      lastUsed: data.time.toDate().toISOString(),
      id: doc.id,
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}