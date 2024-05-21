import { addDoc, collection, deleteDoc, doc, documentId, getDoc, getDocs, getFirestore, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { loadingStateEnum } from "../Types";
import { db } from "../app/_layout";


export async function addPost(item: post): Promise<{
  result: loadingStateEnum.success;
  id: string
} | {result: loadingStateEnum.failed}> {
  try {
    let resultTechnologies: string[] = []
    for (let index = 0; index < item.technologies.length; index += 1) {
      resultTechnologies.push(item.technologies[index].id)
    }
    //TODO collection
    //TODO assests
    let result = await addDoc(collection(db, 'Posts'), {
      title: item.title,
      cover: item.cover.name,
      updated: new Date().toISOString(),
      content: item.content,
      type: 'Coding',
      url: item.url,
      githubUrl: item.githubUrl,
      status: item.status,
      technologies: resultTechnologies,
      hidden: item.hidden
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

export async function updatePost(item: post) {
  try {
    let resultTechnologies: string[] = []
    for (let index = 0; index < item.technologies.length; index += 1) {
      resultTechnologies.push(item.technologies[index].id)
    }

    await updateDoc(doc(db, 'Posts', item.id), {
      title: item.title,
      cover: item.cover.name,
      content: item.content,
      url: item.url,
      githubUrl: item.githubUrl,
      status: item.status,
      technologies: resultTechnologies,
      hidden: item.hidden
    })
    return loadingStateEnum.success
  } catch {
    return loadingStateEnum.failed
  }
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db, 'Posts', id))
}

async function getTechnologies(unique: string[]) {
  let resultTechnologies: technology[] = []

  if (unique.length >= 1) {
    const technologiesSnapshot = await getDocs(query(collection(db, "Technologies"), where(documentId(), 'in', unique)))
    technologiesSnapshot.forEach((doc) => {
      const data = doc.data()
      resultTechnologies.push({
        content: data.content,
        name: data.name,
        displayTechnology: data.displayTechnology,
        firstUsed: data.firstUsed.toDate().toISOString(),
        lastUsed: data.lastUsed.toDate().toISOString(),
        id: doc.id,
      })
    })
  }
  return resultTechnologies
}

export async function listPosts(hidden: boolean, type?: "Coding" | "Activities"): Promise<{result: loadingStateEnum.failed}|{result: loadingStateEnum.success, data: post[]}> {
  //TODO error and handel paginate
  let resultData: post[] = []
  let q = query(collection(db, "Posts"))
  if (hidden === false && type === "Coding") {
    q = query(collection(db, "Posts"), where("hidden", "==", false), where("type", "==", "Coding"));
  } else if (hidden === false && type === "Activities") {
    q = query(collection(db, "Posts"), where("hidden", "==", false), where("type", "==", "Activities"));
  } else if (type === "Coding") {
    q = query(collection(db, "Posts"), where("type", "==", "Coding"));
  } else if (type === "Activities") {
    q = query(collection(db, "Posts"), where("type", "==", "Activities"));
  } 
  const querySnapshot = await getDocs(q);
  let technologies = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    for (let index = 0; index < data.technologies.length; index += 1) {
      if (!technologies.includes(data.technologies[index])) {
        technologies.push(data.technologies[index])
      }
    }
  })

  const resultTechnologies = await getTechnologies(technologies)

  querySnapshot.forEach((doc) => {
    const data = doc.data()
    let foundTechnologies: technology[] = []
    for (let index = 0; index < data.technologies.length; index += 1) {
      let found = resultTechnologies.find((e) => {return e.id === data.technologies[index]})
      if (found !== undefined) {
        foundTechnologies.push(found)
      }
      // This would be an error if undefined but best to ignore it rather than do anything
    }


    resultData.push({
      title: data.title,
      cover: {
        id: "",
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
      technologies: foundTechnologies,
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
      let resultTechnologies = await getTechnologies(data.technologies)
      return { result: loadingStateEnum.success, data: {
        title: data.title,
        cover: {
          id: "",
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
        technologies: resultTechnologies,
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