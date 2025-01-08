import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { loadingStateEnum } from "../Types";
import { db } from "../app/_layout";

export async function deleteTechnology(id: string): Promise<loadingStateEnum> {
  try {
    await deleteDoc(doc(db, "Technologies", id))
    return loadingStateEnum.success
  } catch {
    return loadingStateEnum.failed
  }
}

export async function addTechnology(item: technology): Promise<{
  result: loadingStateEnum.success,
  id: String
} | {
  result: loadingStateEnum.failed
}> {
  try {
    const result = await addDoc(collection(db, 'Technologies'), {
      content: item.content,
      name: item.name,
      displayTechnology: item.displayTechnology,
      firstUsed: serverTimestamp(),
      lastUsed: serverTimestamp(),
    })
    return {
      result: loadingStateEnum.success,
      id: result.id
    }
  } catch {
    return {
      result: loadingStateEnum.failed
    }
  }
}

export async function updateTechnology(item: technology): Promise<loadingStateEnum> {
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

export async function getTechnology(id: string): Promise<{
  result: loadingStateEnum.success,
  data: technology
} | {
  result: loadingStateEnum.failed
} | {
  result: loadingStateEnum.notFound
}> {
  try {
    const db = getFirestore()
    const result = await getDoc(doc(db, "Technologies", id));
    if (result.exists()) {
      const data = result.data()
      return {
        result: loadingStateEnum.success,
        data: {
          content: data.content,
          name: data.name,
          firstUsed: data.firstUsed.toDate().toISOString(),
          lastUsed: data.lastUsed.toDate().toISOString(),
          displayTechnology: data.displayTechnology,
          id: result.id
        }
      }
    }
    return { result: loadingStateEnum.notFound }
  } catch {
    return { result: loadingStateEnum.failed }
  }
}