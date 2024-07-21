import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { loadingStateEnum, uploadStateEnum } from "../Types";
import { listStorageItems, useUploadFile } from "../ulti/storageFunctions";
import { FlatList, Pressable, View, Text, Image, ListRenderItemInfo, ActivityIndicator, useWindowDimensions } from "react-native";
import StyledButton from "./StyledButton";
import { TrashIcon } from "./Icons";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../app/_layout";
import { deleteObject, ref } from "firebase/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";


function FileItem({
  onSelect,
  selectedFile,
  item,
  files,
  setFiles
}:{
  onSelect: (item: storageItem | undefined) => void;
  selectedFile: undefined|storageItem
  item: ListRenderItemInfo<storageItem>
  files: storageItem[],
  setFiles: (item: storageItem[]) => void
}) {
  const [deleteFileState, setDeleteFileState] = useState<loadingStateEnum>(loadingStateEnum.notStarted)

  async function deleteFile(file: storageItem) {
    try {
      setDeleteFileState(loadingStateEnum.loading)
      if (file.name === selectedFile.name) {
        onSelect(undefined)
      }
      await deleteDoc(doc(db, "Files", file.id))
      const storageRef = ref(storage, file.name);
      await deleteObject(storageRef)
      let newFiles = [...files].filter((e) => {return e.name !== item.item.name})
      setFiles(newFiles)
      setDeleteFileState(loadingStateEnum.success)
    } catch {
      setDeleteFileState(loadingStateEnum.failed)
    }
  }

  return (
    <Pressable  onPress={(e) => {onSelect(item.item)}} style={{flexDirection: 'row', margin: 10, backgroundColor: selectedFile.name === item.item.name ? "gray":'white', borderWidth: 2, borderRadius: 30, borderColor: 'black', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, overflow: 'hidden'}}>
      {item.item.loadingState === loadingStateEnum.success ?
        <Image source={{uri: item.item.url}} style={{width: 100, height: 100}}/>:null
      }
      <Text selectable={false} style={{padding: 10}}>{item.item.name}</Text>
      <Pressable onPress={() => {
        if (deleteFileState !== loadingStateEnum.notStarted) {
          return
        }
        deleteFile(item.item)
      }} style={{backgroundColor: 'red', marginLeft: 'auto'}}>
        {(deleteFileState === loadingStateEnum.loading) ?
          <ActivityIndicator style={{height: 16.4, width: 16.4}}/>:null
        }
        {(deleteFileState === loadingStateEnum.failed) ?
          <Text>!</Text>:null
        }
        {(deleteFileState !== loadingStateEnum.failed && deleteFileState !== loadingStateEnum.loading) ?
          <TrashIcon width={16.4} height={16.4} style={{ marginTop: 'auto', marginBottom: 'auto', paddingLeft: 10, paddingRight: 5 }}/>:null
        }
      </Pressable>
    </Pressable>
  )
}

export default function SelectFile({onClose, onSelect, selectedFile}:{onClose: () => void, onSelect: (item: storageItem | undefined) => void, selectedFile: undefined|storageItem}) {
  const { height, width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [fileState, setFileState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [files, setFiles] = useState<storageItem[]>([]);

  const { uploadFile, uploadState, uploadProgress } = useUploadFile()

  async function loadFiles() {
    const result = await listStorageItems();
    if (result.result === loadingStateEnum.success) {
      setFiles(result.data)
      setFileState(loadingStateEnum.success)
    } else {
      setFileState(loadingStateEnum.failed)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  if (fileState === loadingStateEnum.success) {
    return ( 
      <View style={{width, height, backgroundColor: "#1c93ba", paddingBottom: insets.bottom, paddingTop: insets.top}}>
        <Pressable onPress={() => onClose()}>
          <Text>Close</Text>
        </Pressable>
        <Text style={{fontSize: height * 0.1, fontFamily: 'Bungee-Regular', color: 'white', marginHorizontal: 20, textAlign: 'center'}} adjustsFontSizeToFit numberOfLines={1}>Select File</Text>
        <FlatList
          data={files}
          renderItem={(item) => (
            <FileItem
              onSelect={onSelect}
              selectedFile={selectedFile}
              item={item}
              files={files}
              setFiles={setFiles} />
          )}
        />
        { (uploadState !== uploadStateEnum.notStarted) ?
          <Text>Upload: {uploadProgress}</Text>:<StyledButton onPress={() => uploadFile()} text='Upload File' style={{padding: 10}}/>
        }
      </View>
    )
  }

  return (
    <View>
      <Pressable onPress={() => onClose()}>
        <Text>Close</Text>
      </Pressable>
      { fileState === loadingStateEnum.loading ?
        <View>
          <Text>Loading</Text>
        </View>:
        <View>
          <Text>Failed</Text>
        </View>
      }
      { (uploadState !== uploadStateEnum.notStarted) ?
        <Text>Upload: {uploadProgress}</Text>:<StyledButton onPress={() => uploadFile()} text='Upload File' style={{padding: 10}}/>
      }
    </View>
  )
}