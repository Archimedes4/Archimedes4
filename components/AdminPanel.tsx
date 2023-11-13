import { View, Text, TextInput, Pressable, Modal, FlatList, ScrollView, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { listStorageItems, uploadFile } from '../ulti/storageFunctions';
import { loadingStateEnum } from '../Types';
import { addPost, listPosts } from '../ulti/postFunctions';
import { useNavigate } from 'react-router-native';
import Header from './Header';
import MarkdownCross from './MarkdownCross';
import TextEditor from './TextEditor';

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

function EditPost({onBack}:{onBack: () => void}) {
  //View
  const navigate = useNavigate()
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [isAssest, setIsAssest] = useState<boolean>(false);
  const [isPickingCover, setIsPickingCover] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<'C'|'P'>('C');
  const [isCard, setIsCard] = useState<'C'|'B'>('C');

  //New Item
  const [newPost, setNewPost] = useState<post>({
    title: 'Create New Post',
    cover: {
      name: '',
      fileType: '',
      loadingState: loadingStateEnum.failed
    },
    content: '',
    assests: [],
    date: '',
    type: '',
    id: 'Create'
  })
  return (
    <View>
      <Modal visible={isAssest || isPickingCover}>
        <SelectFile onClose={() => {setIsAssest(false); setIsPickingCover(false)}} onSelect={(e) => {if (isPickingCover) setNewPost({...newPost, cover: e}); else setNewPost({...newPost, assests: [...newPost.assests, e]})}}/>
      </Modal>
      <Pressable onPress={() => {onBack()}} style={{pointerEvents: "none"}}>
        <Text>Back</Text>
      </Pressable>
      <SegmentedButtons
        value={isCard}
        onValueChange={(e) => {if (e === 'C') {setIsCard('C')} else {setIsCard('B')}}}
        buttons={[
          {
            value: 'C',
            label: 'Card',
          },
          {
            value: 'B',
            label: 'Blog',
          },
        ]}
      />
      { isCard === 'C' ?
        (
          <>
            <Text>Title</Text>
            <TextInput value={newPost.title} onChangeText={(e) => setNewPost({...newPost, title: e})}/>
            <Text>Cover</Text>
            <Pressable onPress={() => setIsPickingCover(true)}>
              <Text>Pick Cover</Text>
            </Pressable>
            <Text>Technologies</Text>
            <Text>Url</Text>
            <Text>Status</Text>
          </>
        ):
        (
          <>
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
            <ScrollView style={{width: width, height: height}}>
              {isPreview === 'P' ?
                <MarkdownCross markdown={newPost.content}/>:
                <TextEditor text={newPost.content} onChangeText={(e) => {console.log(e); setNewPost({...newPost, content: e})}} />
              }
            </ScrollView>
            <Text>Assests</Text>
            <Pressable onPress={() => setIsAssest(true)}>
              <Text>Add Asset</Text>
            </Pressable>
          </>
        )
      }
      <Pressable onPress={() => {addPost(newPost)}}>
        <Text>Create Post</Text>
      </Pressable>
    </View>
  )
}

export default function AdminPanel() {
  //View
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [posts, setPosts] = useState<post[]>([]);
  const [selectedPost, setSeletedPost] = useState<post | undefined>(undefined)

  async function loadPost() {
    const result = await listPosts();
    if (result.result === loadingStateEnum.success) {
      setPosts([...result.data, {
        title: 'Create New Post',
        cover: {
          name: '',
          fileType: '',
          loadingState: loadingStateEnum.failed
        },
        content: '',
        assests: [],
        date: '',
        type: '',
        id: 'Create'
      }])
    }
  }

  useEffect(() => {
    loadPost()
  }, [])

  return (
    <View style={{width: width, height: height}}>
      <Header />
      <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>AdminPanel</Text>
      { selectedPost !== undefined ?
        <EditPost onBack={() => setSeletedPost(undefined)} />:
        <FlatList 
          data={posts}
          renderItem={(post) => (
            <Pressable key={post.item.id} onPress={() => setSeletedPost(post.item)}>
              <Text>{post.item.title}</Text>
            </Pressable>
          )}
        />
      }
    </View>
  )
}