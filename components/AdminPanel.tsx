import { View, Text, TextInput, Pressable, Modal, FlatList, ScrollView, NativeSyntheticEvent, TextInputKeyPressEventData, ListRenderItemInfo } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SegmentedButtons } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { listStorageItems, uploadFile } from '../ulti/storageFunctions';
import { loadingStateEnum } from '../Types';
import { addPost, listPosts, updatePost } from '../ulti/postFunctions';
import { useNavigate } from 'react-router-native';
import Header from './Header';
import MarkdownCross from './MarkdownCross';
import TextEditor from './TextEditor';

function SelectFile({onClose, onSelect, selectedFile}:{onClose: () => void, onSelect: (item: storageItem) => void, selectedFile: undefined|storageItem}) {
  const [fileState, setFileState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [files, setFiles] = useState<storageItem[]>([]);

  async function loadFiles() {
    const result = await listStorageItems();
    if (result.result === loadingStateEnum.success) {
      console.log(result.data)
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
                <Pressable onPress={() => onSelect(item.item)} style={{
                  backgroundColor: (item.item.name === selectedFile.name) ? "#d3d3d3":"white",
                  shadowColor: 'black',
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 1,
                  shadowRadius: 5,
                  margin: 4,
                  padding: 4, borderRadius: 15
                }}>
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

function EditPost({onBack, newPost, setNewPost}:{onBack: () => void, newPost: post, setNewPost: (item: post) => void}) {
  //View
  const navigate = useNavigate()
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [isAssest, setIsAssest] = useState<boolean>(false);
  const [isPickingCover, setIsPickingCover] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<'C'|'P'>('C');
  const [isCard, setIsCard] = useState<'C'|'B'>('C');
  const [isHover, setIsHover] = useState<boolean>(false);
  const [technologies, setTechnologies] = useState<technology[]>([]);
  const [techState, setTechState] = useState<loadingStateEnum>(loadingStateEnum.loading);

  async function loadTechnologies() {

  }

  return (
    <View>
      <Modal visible={isAssest}>
        <SelectFile selectedFile={newPost.cover} onClose={() => {setIsAssest(false)}} onSelect={(e) => {setNewPost({...newPost, assests: [...newPost.assests, e]})}}/>
      </Modal>
      <Modal visible={isPickingCover}>
        <SelectFile selectedFile={newPost.cover} onClose={() => {setIsPickingCover(false)}} onSelect={(e) => {setNewPost({...newPost, cover: e})}}/>
      </Modal>
      <Pressable onPress={() => {onBack()}}>
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
          <View style={{margin: 5}}>
            <View>
              <Text>Title</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.title} onChangeText={(e) => setNewPost({...newPost, title: e})}/>
              <Text>Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.url} onChangeText={(e) => {setNewPost({...newPost, url: e})}}/>
              <Text>Status</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.status} onChangeText={(e) => {setNewPost({...newPost, status: e})}}/>
              <Text style={{borderBottomColor: "black", borderBottomWidth: 2}}>Github Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.githubUrl} onChangeText={(e) => {setNewPost({...newPost, githubUrl: e})}}/>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text>Cover</Text>
                <Pressable onPress={() => setIsPickingCover(true)}>
                  <Text>Pick Cover</Text>
                </Pressable>
              </View>
            </View>
            <View>
              <Text>Technologies</Text>
              <FlatList
                data={technologies}
                renderItem={() => (
                  <View>

                  </View>
                )}
              />
            </View>
          </View>
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
      <Pressable onPress={() => {(newPost.id === 'Create') ? addPost(newPost):updatePost(newPost)}} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} style={{backgroundColor: isHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
        <Text style={{margin: 10}}>{(newPost.id === 'Create') ? 'Create Post':'Edit Post'}</Text>
      </Pressable>
    </View>
  )
}

function AdminPostBlock({post, setSelectedPost}:{post: ListRenderItemInfo<post>, setSelectedPost: (item: post) => void}) {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <Pressable onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} key={post.item.id} onPress={() => setSelectedPost(post.item)} style={{backgroundColor: isHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
      <Text style={{marginLeft: 10, marginRight: 'auto', marginTop: 10, marginBottom: 10}}>{post.item.title}</Text>
    </Pressable>  
  )
}

export default function AdminPanel() {
  //View
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [posts, setPosts] = useState<post[]>([]);
  const [selectedPost, setSelectedPost] = useState<post | undefined>(undefined)
  const navigate = useNavigate()
  const [isMessageHover, setIsMessageHover] = useState<boolean>(false);
  const [isTechHover, setIsTechHover] = useState<boolean>(false);

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
        updated: '',
        type: '',
        id: 'Create',
        status: 'inProgress',
        url: '',
        technologies: [],
        githubUrl: ''
      }])
    }
  }

  useEffect(() => {
    loadPost()
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header />
      <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>AdminPanel</Text>
      { selectedPost !== undefined ?
        <EditPost newPost={selectedPost} setNewPost={setSelectedPost} onBack={() => setSelectedPost(undefined)} />:
        <FlatList 
          data={posts}
          renderItem={(post) => (
            <AdminPostBlock post={post} setSelectedPost={setSelectedPost} />
          )}
        />
      }
      <View style={{flexDirection: 'row'}}>
        <View style={{width: width/2}}>
          <Pressable onHoverIn={() => setIsMessageHover(true)} onHoverOut={() => setIsMessageHover(false)} onPress={() => navigate('/admin/message')} style={{backgroundColor: isMessageHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>Messages</Text>
          </Pressable>
        </View>
        <View style={{width: width/2}}>
          <Pressable onHoverIn={() => setIsTechHover(true)} onHoverOut={() => setIsTechHover(false)} onPress={() => navigate('/admin/tech')} style={{backgroundColor: isTechHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>Technologies</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}