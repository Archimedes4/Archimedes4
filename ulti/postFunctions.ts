import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { app } from "../app/_layout"
import { loadingStateEnum } from "../Types";


export async function addPost(item: post) {
  const db = getFirestore(app);
  console.log( {
    title: item.title,
    cover: item.cover.name,
    updated: serverTimestamp(),
    content: item.content,
    type: 'Coding',
    url: item.url,
    githubUrl: item.githubUrl,
    status: item.status,
    technologies: item.technologies,
    hidden: item.hidden
  })
  await addDoc(collection(db, 'Posts'), {
    title: item.title,
    cover: item.cover.name,
    updated: serverTimestamp(),
    content: item.content,
    type: 'Coding',
    url: item.url,
    githubUrl: item.githubUrl,
    status: item.status,
    technologies: item.technologies,
    hidden: item.hidden
  })
  //TODO collection
  //TODO assests
}

export async function updatePost(item: post) {
  const db = getFirestore(app);
  console.log(item)
  await updateDoc(doc(db, 'Posts', item.id), {
    title: item.title,
    cover: item.cover.name,
    content: item.content,
    url: item.url,
    githubUrl: item.githubUrl,
    status: item.status,
    technologies: item.technologies,
    hidden: item.hidden
  })
}

export async function deletePost(id: string) {
  const db = getFirestore(app);
  await deleteDoc(doc(db, 'Posts', id))
}

export async function listPosts(hidden: boolean): Promise<{result: loadingStateEnum.failed}|{result: loadingStateEnum.success, data: post[]}> {
  const db = getFirestore();
  //TODO error and handel paginate
  let resultData: post[] = []
  const q = hidden ? collection(db, "Posts"): query(collection(db, "Posts"), where("hidden", "==", false));
  const querySnapshot = await getDocs(q);
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
      githubUrl: data.githubUrl,
      hidden: data.hidden,
      views: []
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}

export async function getPost(id: string): Promise<{result: loadingStateEnum.failed}|{result: loadingStateEnum.success, data: post}|{result: loadingStateEnum.notFound}> {
  try {
    const db = getFirestore();
    const document = await getDoc(doc(db, "Posts", id))
    if (document.exists()) {
      const data = document.data()
      return { result: loadingStateEnum.success, data: {
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
        id: document.id,
        status: data.status,
        url: data.url,
        technologies: data.technologies,
        githubUrl: data.githubUrl,
        hidden: data.hidden,
        views: []
      }}
    } else {
      return { result: loadingStateEnum.notFound }
    }
  } catch {
    return {result: loadingStateEnum.failed}
  }
}