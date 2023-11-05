import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { loadingStateEnum } from "../Types";
import * as DocumentPicker from 'expo-document-picker';
import { addDoc, collection, doc, getDocs, getFirestore, getDoc, query, orderBy, startAt } from "firebase/firestore";

export async function listStorageItems(): Promise<{result: loadingStateEnum.failed}|{result: loadingStateEnum.success, data: storageItem[]}> {
  const db = getFirestore();
  //TODO error handel paginate
  let resultData: storageItem[] = []
  const q = query(collection(db, "Files"), orderBy('updated'), startAt(0));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    resultData.push({
      name: data.name,
      fileType: data.fileType,
      loadingState: loadingStateEnum.loading
    })
  });
  return {result: loadingStateEnum.success, data: resultData};
}

export async function uploadFile() {
  let result = await DocumentPicker.getDocumentAsync({});
  if (!result.canceled) {
    const response = await fetch(result.assets[0].uri);
    if (response.ok) {
      const blob = await response.blob();
      const storage = getStorage();
      const db = getFirestore()
      const storageRef = ref(storage, result.assets[0].name);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        async () => {
          await addDoc(collection(db, 'Files'), {
            name: result.assets[0].name,
            fileType: result.assets[0].mimeType
          })
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }
      );
    } else {

    }
  }
}

export async function getAssest(item: string): Promise<string> {
  const storage = getStorage()
  const result = await ref(storage, item)
  const url = await getDownloadURL(result)
  return url
}