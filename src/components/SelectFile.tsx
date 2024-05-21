import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { loadingStateEnum } from "../Types";
import { listStorageItems, uploadFile } from "../ulti/storageFunctions";
import { FlatList, Pressable, View, Text, Image } from "react-native";
import StyledButton from "./StyledButton";

export default function SelectFile({onClose, onSelect, selectedFile}:{onClose: () => void, onSelect: (item: storageItem) => void, selectedFile: undefined|storageItem}) {
  const { height, width } = useSelector((state: RootState) => state.dimentions);

  const [fileState, setFileState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [files, setFiles] = useState<storageItem[]>([]);

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
      <View style={{width, height, backgroundColor: "#1c93ba"}}>
        <Pressable onPress={() => onClose()}>
          <Text>Close</Text>
        </Pressable>
        <FlatList
          data={files}
          renderItem={(item) => (
            <Pressable onPress={(e) => {onSelect(item.item)}} style={{backgroundColor: (item.item.name === selectedFile.name) ? "#d3d3d3":"white", flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10, padding: 10}}>
              {item.item.loadingState === loadingStateEnum.success ?
                <Image source={{uri: item.item.url}} style={{width: 100, height: 100}}/>:null
              }
              <Text selectable={false}>{item.item.name}</Text>
            </Pressable>
          )}
        />
        <StyledButton onPress={() => uploadFile()} text='Upload File' style={{padding: 10}}/>
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
      <StyledButton onPress={() => uploadFile()} text='Upload File' style={{padding: 10}}/>
    </View>
  )
}