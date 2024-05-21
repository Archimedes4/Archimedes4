import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { loadingStateEnum, uploadStateEnum } from "../Types";
import * as DocumentPicker from 'expo-document-picker';
import { addDoc, collection, doc, getDocs, getFirestore, getDoc, query, orderBy, startAt } from "firebase/firestore";
import { db, storage } from "../app/_layout";
import { useState } from "react";

export async function listStorageItems(): Promise<{result: loadingStateEnum.failed}|{result: loadingStateEnum.success, data: storageItem[]}> {
  //TODO error handel paginate
  let resultData: storageItem[] = []
  const q = query(collection(db, "Files"), orderBy('name'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    resultData.push({
      name: data.name,
      fileType: data.fileType,
      loadingState: loadingStateEnum.notStarted,
      id: doc.id
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}

export function useUploadFile() {
  const [uploadState, setUploadState] = useState<uploadStateEnum>(uploadStateEnum.notStarted)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  async function uploadFile() {
    if (uploadState !== uploadStateEnum.failed && uploadState !== uploadStateEnum.success && uploadState !== uploadStateEnum.notStarted) {
      return
    }
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      if (response.ok) {
        const blob = await response.blob();
        const storageRef = ref(storage, result.assets[0].name);

        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress)
            switch (snapshot.state) {
              case 'paused':
                setUploadState(uploadStateEnum.paused)
                break;
              case 'running':
                setUploadState(uploadStateEnum.running)
                break;
            }
          }, 
          () => {
            setUploadState(uploadStateEnum.failed)
          }, 
          async () => {
            await addDoc(collection(db, 'Files'), {
              name: uploadTask.snapshot.ref.name,
              fileType: result.assets[0].mimeType
            })
            setUploadState(uploadStateEnum.success)
          }
        );
      } else {

      }
    }
  }

  return {
    uploadFile,
    uploadState,
    uploadProgress
  }
}

export async function getAssest(item: string): Promise<{result: loadingStateEnum.success, data: string}|{result: loadingStateEnum.failed}> {
  try {
    const result = await ref(storage, item)
    const url = await getDownloadURL(result)
    return {result: loadingStateEnum.success, data: url}
  } catch {
    return {result: loadingStateEnum.failed}
  }
}

export async function getMarkdownFromAssets(assets: postAsset[]) {
  if (assets.length >= 1) {
    let results: Promise<{result: loadingStateEnum.success, data: string}|{result: loadingStateEnum.failed}>[] = []
    for (let index = 0; index < assets.length; index += 1) {
      results.push(getAssest(assets[index].item.name));
    }
    let stringResult = "\n"
    const finalResult = await Promise.all(results);
    for (let index = 0; index < finalResult.length; index += 1) {
      const item = finalResult[index]
      if (item.result === loadingStateEnum.success) {
        stringResult += `\n[${assets[index].id}]:${item.data}`
      }
    }
    return stringResult;
  } else {
    return ""
  }
}