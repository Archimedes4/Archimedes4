import { addDoc, collection, getDocs, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from "../App";
import { loadingStateEnum } from "../Types";


export async function addPost(item: post) {
  const db = getFirestore(app);
  await addDoc(collection(db, 'Posts'), {
    title: item.title,
    cover: item.cover.name,
    updated:  serverTimestamp(),
    content: item.content,
    type: 'Coding'
  })
  //TODO collection
}

export async function listPosts(): Promise<{result: loadingStateEnum.failed}|{result: loadingStateEnum.success, data: post[]}> {
  const db = getFirestore();
  //TODO error and handel paginate
  let resultData: post[] = []
  const querySnapshot = await getDocs(collection(db, "Posts"));
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    resultData.push({
      title: data.title,
      cover: {
        name: data.cover,
        fileType: "",
        loadingState: loadingStateEnum.notStarted
      },
      assests: [],
      content: data.content,
      date: data.updated,
      type: data.type
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}