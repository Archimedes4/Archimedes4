import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { app } from "../app/_layout"
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

export async function updateTechnology(item: technology): Promise<loadingStateEnum> {
  const db = getFirestore(app);
  try {
    await updateDoc(doc(db, 'Technologies', item.id), {
      contact: item.content,
      name: item.name,
      displayTechnology: item.displayTechnology,
      firstUsed: item.firstUsed,
      lastUsed: item.lastUsed,
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
  const q = query(collection(db, "Technologies"), orderBy('lastUsed'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    resultData.push({
      content: data.content,
      name: data.name,
      displayTechnology: data.displayTechnology,
      firstUsed: data.firstUsed.toDate().toISOString(),
      lastUsed: data.lastUsed.toDate().toISOString(),
      id: doc.id,
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}