import { View, Text, TextInput, Pressable, Modal, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { listStorageItems, uploadFile } from '../ulti/storageFunctions';
import { loadingStateEnum } from '../Types';
import { addPost } from '../ulti/postFunctions';
import { useNavigate } from 'react-router-native';
import Header from './Header';

function SelectFile({onClose, onSelect}:{onClose: () => void, onSelect: (item: storageItem) => void}) {
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
      { fileState === loadingStateEnum.loading ?
        <View>
          <Text>Loading</Text>
        </View>:
        <>
          { fileState === loadingStateEnum.success ?
            <FlatList
              data={files}
              renderItem={(item) => (
                <Pressable onPress={() => onSelect(item.item)}>
                  <Text>{item.item.name}</Text>
                </Pressable>
              )}
            />:
            <View>
              <Text>Failed</Text>
            </View>

          }
        </>

      }
      <Pressable onPress={() => uploadFile()}>
        <Text>Upload File</Text>
      </Pressable>
    </View>
  )
}

export default function AdminPanel() {
  //View
  const navigate = useNavigate()
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [isAssest, setIsAssest] = useState<boolean>(false);
  const [isCover, setIsCover] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<'C'|'P'>('C');

  //New Item
  const [newPost, setNewPost] = useState<post>({
    title: '',
    cover: {
      name: '',
      fileType: '',
      loadingState: loadingStateEnum.failed
    },
    content: '',
    assests: [],
    date: '',
    type: ''
  })
  return (
    <View style={{width: width, height: height}}>
      <Modal visible={isAssest || isCover}>
        <SelectFile onClose={() => {setIsAssest(false); setIsCover(false)}} onSelect={(e) => {if (isCover) setNewPost({...newPost, cover: e}); else setNewPost({...newPost, assests: [...newPost.assests, e]})}}/>
      </Modal>
      <Header />
      <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>AdminPanel</Text>
      <TextInput value={newPost.title} onChangeText={(e) => setNewPost({...newPost, title: e})}/>
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
      <TextInput value={newPost.content} onChangeText={(e) => setNewPost({...newPost, content: e})} multiline={true} style={{textAlign: "left", lineHeight: 16, width: 100000 }}/>
      <Text>Assests</Text>
      <Pressable onPress={() => setIsAssest(true)}>
        <Text>Add Asset</Text>
      </Pressable>
      <Pressable onPress={() => {addPost(newPost)}}>
        <Text>Create Post</Text>
      </Pressable>
    </View>
  )
}