import { View, Text, TextInput, Pressable, Modal, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { listStorageItems, uploadFile } from '../ulti/storageFunctions';
import { loadingStateEnum } from '../Types';

function SelectFile({onClose, onSelect}:{onClose: () => void, onSelect: (storageItem) => void}) {
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

  return (
    <View>
      <Pressable onPress={() => onClose()}>
        <Text>Close</Text>
      </Pressable>
      <>
      
      </>
      <FlatList
        data={files}
        renderItem={(item) => (
          <Pressable onPress={() => onSelect(item.item)}>
            <Text>{item.item.name}</Text>
          </Pressable>
        )}
      />
      <Pressable onPress={() => uploadFile()}>
        <Text>Upload File</Text>
      </Pressable>
    </View>
  )
}

export default function AdminPanel() {
  //View
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [isAssest, setIsAssest] = useState<boolean>(false);
  const [isCover, setIsCover] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<'C'|'P'>('C');

  //New Item
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [cover, setCover] = useState<storageItem>();
  const [contentAssests, setContentAssest] = useState<storageItem[]>([]);
  return (
    <View style={{width: width, height: height}}>
      <Modal visible={isAssest || isCover}>
        <SelectFile onClose={() => {setIsAssest(false); setIsCover(false)}} onSelect={(e) => {if (isCover) setCover(e); else setContentAssest([...contentAssests, e])}}/>
      </Modal>
      <Text>AdminPanel</Text>
      <TextInput value={title} onChangeText={setTitle}/>
      <Text>Cover</Text>
      <Pressable onPress={() => setIsCover(true)}>
        <Text>Pick Cover</Text>
      </Pressable>
      <Text>Mark down is used</Text>
      <SegmentedButtons
        value={isPreview}
        onValueChange={(e) => {if (e === 'C') {setIsPreview('C')} else {setIsPreview('P')}}}
        buttons={[
          {
            value: 'C',
            label: 'Code',
          },
          {
            value: 'P',
            label: 'Preview',
          },
        ]}
      />
      <TextInput value={content} onChangeText={setContent} multiline={true} style={{textAlign: "left", lineHeight: 16, width: 100000 }}/>
      <Text>Assests</Text>
      <Pressable onPress={() => setIsAssest(true)}>
        <Text>Add Asset</Text>
      </Pressable>
      <Pressable onPress={() => {}}>
        <Text>Create Post</Text>
      </Pressable>
    </View>
  )
}