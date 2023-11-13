import { addDoc, collection, doc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { app } from "../App";
import { loadingStateEnum } from "../Types";


export async function addPost(item: post) {
  const db = getFirestore(app);
  await addDoc(collection(db, 'Posts'), {
    title: item.title,
    cover: item.cover.name,
    updated: serverTimestamp(),
    content: item.content,
    type: 'Coding',
    url: item.url,
    githubUrl: item.githubUrl,
    status: item.status,
    technologies: item.technologies
  })
  //TODO collection
  //TODO assests
}

export async function updatePost(item: post) {
  const db = getFirestore(app);
  console.log( {
    title: item.title,
    cover: item.cover.name,
    content: item.content,
    url: item.url,
    githubUrl: item.githubUrl,
    status: item.status,
    technologies: item.technologies
  })
  await updateDoc(doc(db, 'Posts', item.id), {
    title: item.title,
    cover: item.cover.name,
    content: item.content,
    url: item.url,
    githubUrl: item.githubUrl,
    status: item.status,
    technologies: item.technologies
  })
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
      updated: data.updated,
      type: data.type,
      id: doc.id,
      status: data.status,
      url: data.url,
      technologies: data.technologies,
      githubUrl: data.githubUrl
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}