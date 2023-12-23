/*
  Ultimate Tic Tac Toe
  Andrew Mainella

*/
import { View, Text, TextInput, Pressable, Modal, FlatList, ScrollView, ListRenderItemInfo, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { getAssest, listStorageItems, uploadFile } from '../../../ulti/storageFunctions';
import { loadingStateEnum } from '../../../Types';
import { addPost, deletePost, listPosts, updatePost } from '../../../ulti/postFunctions';
import Header from '../../../components/Header';
import MarkdownCross from '../../../components/MarkdownCross';
import TextEditor from '../../../components/TextEditor';
import { listTechnologies } from '../../../ulti/technologyFunctions';
import SVGXml from '../../../components/SVGXml/SVGXml';
import StyledButton from '../../../components/StyledButton';
import { MoreHIcon, MoreVIcon, TrashIcon } from '../../../components/Icons';

function SelectFile({onClose, onSelect, selectedFile}:{onClose: () => void, onSelect: (item: storageItem) => void, selectedFile: undefined|storageItem}) {
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
            <Pressable onPress={(e) => {console.log(item.item); onSelect(item.item)}} style={{backgroundColor: (item.item.name === selectedFile.name) ? "#d3d3d3":"white", flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10, padding: 10}}>
              {item.item.loadingState === loadingStateEnum.success ?
                <Image source={{uri: item.item.url}} style={{width: 100, height: 100}}/>:null
              }
              <Text>{item.item.name}</Text>
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

function EditPost({onBack, newPost, setNewPost}:{onBack: () => void, newPost: post, setNewPost: (item: post) => void}) {
  //View
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [isAssest, setIsAssest] = useState<boolean>(false);
  const [isPickingCover, setIsPickingCover] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isCard, setIsCard] = useState<boolean>(true);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [technologies, setTechnologies] = useState<technology[]>([]);
  const [techState, setTechState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [coverImageHeight, setCoverImageHeight] = useState<number>(0);
  const [isNavHidden, setIsNavHidden] = useState<boolean>(false);

  async function loadTechnologies() {
    const result = await listTechnologies();
    if (result.result === loadingStateEnum.success) {
      console.log(result.data)
      setTechnologies(result.data);
      setTechState(loadingStateEnum.success);
    } else {
      setTechState(loadingStateEnum.failed);
    }
  }

  async function loadCover() {
    setNewPost({...newPost, cover: {...newPost.cover, loadingState: loadingStateEnum.loading}})
    const result = await getAssest(newPost.cover.name);
    console.log(result)
    if (result.result === loadingStateEnum.success) {
      setNewPost({...newPost, cover: {...newPost.cover, loadingState: loadingStateEnum.success, url: result.data}})
    } else {
      setNewPost({...newPost, cover: {...newPost.cover, loadingState: loadingStateEnum.failed}})
    }
  }

  useEffect(() => {
    if (newPost.cover.loadingState === loadingStateEnum.notStarted) {
      loadCover();
    }
  }, [newPost.cover]);

  useEffect(() => {
    loadTechnologies();
  }, [])

  if (isCard) {
    return (
      <>
        <Modal visible={isPickingCover}>
          <SelectFile selectedFile={newPost.cover} onClose={() => {setIsPickingCover(false)}} onSelect={(e) => {setNewPost({...newPost, cover: e})}}/>
        </Modal>
        <StyledButton onPress={() => {onBack()}} text='Back' textStyle={{margin: 10}} style={{width: width - 40, marginLeft: 'auto', marginRight: 'auto'}}/>
        <View style={{width: width-40, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginLeft: 'auto', marginRight: 'auto'}}>
          <Pressable onPress={() => setIsCard(true)} style={{backgroundColor: isCard ? '#d3d3d3':'white', width: width/2-20}}>
            <Text style={{margin: 10}}>Card</Text>
          </Pressable>
          <Pressable onPress={() => setIsCard(false)} style={{backgroundColor: isCard ? 'white':'#d3d3d3', width: width/2-20}}>
            <Text style={{margin: 10}}>Blog</Text>
          </Pressable>
        </View>
        <View style={{margin: 5}}>
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <View style={{margin: 5, marginTop: 10}}>
              <Text>Title</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.title} onChangeText={(e) => setNewPost({...newPost, title: e})}/>
              <Text>Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.url} onChangeText={(e) => {setNewPost({...newPost, url: e})}}/>
              <Text>Status</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.status} onChangeText={(e) => {setNewPost({...newPost, status: e})}}/>
              <Text style={{borderBottomColor: "black", borderBottomWidth: 2}}>Github Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4}} value={newPost.githubUrl} onChangeText={(e) => {setNewPost({...newPost, githubUrl: e})}}/>
            </View>
          </View>
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}}>
            {newPost.cover.name !== '' ?
              <>
                {newPost.cover.loadingState ===loadingStateEnum.success ?
                  <Image source={{uri: newPost.cover.url}} onLoad={(e) => {
                    if (e.nativeEvent.source.height !== undefined) {
                      setCoverImageHeight(e.nativeEvent.source.height/e.nativeEvent.source.width * width);
                    }
                  }} style={{width: width - 20, height: coverImageHeight}}/>:
                  <>
                    {newPost.cover.loadingState === loadingStateEnum.loading ?
                      <View style={{height: 100}}>
                        <Text>Loading</Text>
                      </View>:
                      <View>
                        <Text>Failed</Text>
                      </View>
                    }
                  </>
                }
              </>:
              <View style={{height: 100}}>
                <Text style={{margin: 'auto'}}>No cover has been selected!</Text>
              </View>
            }
            <View style={{flexDirection: 'row', height: 25}}>
              <Text style={{margin: 5, position: 'absolute', left: 5}}>Cover</Text>
              <Pressable style={{margin: 5, position: 'absolute', right: 5}} onPress={() => setIsPickingCover(true)}>
                <Text>Pick Cover</Text>
              </Pressable>
            </View>
          </View>
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{margin: 5, marginTop: 10}}>Technologies</Text>
            <FlatList
              data={technologies}
              renderItem={(e) => (
                <Pressable onPress={() => {
                  const index = newPost.technologies.findIndex((x) => {return x.id === e.item.id});
                  if (index !== -1) {
                    console.log(newPost.technologies.splice(index, 1), index)
                    setNewPost({...newPost, technologies: [...newPost.technologies.splice(index, 1)]})
                  } else {
                    setNewPost({...newPost, technologies: [...newPost.technologies, e.item]})
                  }
                }} style={{backgroundColor: newPost.technologies.some((x) => {return x.id === e.item.id}) ? '#d3d3d3':'white', flexDirection: 'row', margin: 2, padding: 5, borderRadius: 15}}>
                  <SVGXml xml={e.item.content} width={20} height={20}/>
                  <Text>{e.item.name}</Text>
                </Pressable>
              )}
              style={{marginBottom: 15}}
            />
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <Modal visible={isAssest}>
        <SelectFile selectedFile={newPost.cover} onClose={() => {setIsAssest(false)}} onSelect={(e) => {setNewPost({...newPost, assests: [...newPost.assests, {
          item: e,
          id: newPost.assests.length.toString()
        }]})}}/>
      </Modal>
      {!isNavHidden ?
        <>
          <StyledButton onPress={() => {onBack()}} text='Back' textStyle={{margin: 10}} style={{width: width - 40, marginLeft: 'auto', marginRight: 'auto'}}/>
          <View style={{width: width-40, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginLeft: 'auto', marginRight: 'auto'}}>
            <Pressable onPress={() => setIsCard(true)} style={{backgroundColor: isCard ? '#d3d3d3':'white', width: width/2-20}}>
              <Text style={{margin: 10}}>Card</Text>
            </Pressable>
            <Pressable onPress={() => setIsCard(false)} style={{backgroundColor: isCard ? 'white':'#d3d3d3', width: width/2-20}}>
              <Text style={{margin: 10}}>Blog</Text>
            </Pressable>
          </View>
        </>:null
      }
      <View style={{flexDirection: "row"}}>
        <View style={{width: width-96.4, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginLeft: 14, marginRight: 'auto'}}>
          <Pressable onPress={() => setIsPreview(false)} style={{backgroundColor: isPreview ? 'white':'#d3d3d3', width: width/2-48.2}}>
            <Text style={{margin: 10}}>Code</Text>
          </Pressable>
          <Pressable onPress={() => setIsPreview(true)} style={{backgroundColor: !isPreview ? 'white':'#d3d3d3', width: width/2-48.2}}>
            <Text style={{margin: 10}}>Preview</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => {setIsNavHidden(!isNavHidden)}} style={{width: 36.4, height: 36.4, borderRadius: 30, marginRight: 20, backgroundColor: 'white', marginTop: 10, shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 2, borderColor: 'black'}}>
          {isNavHidden ?
            <MoreHIcon width={10} height={10} style={{margin: "auto"}}/>:<MoreVIcon width={10} height={10} style={{margin: "auto"}}/>
          }
        </Pressable>
      </View>
      <ScrollView style={{width: width, height: height}}>
        {isPreview ?
          <MarkdownCross markdown={newPost.content}/>:
          <TextEditor text={newPost.content} onChangeText={(e) => {setNewPost({...newPost, content: e})}} />
        }
      </ScrollView>
      <Text style={{marginLeft: 20}}>Assests</Text>
      <FlatList
        data={newPost.assests}
        renderItem={(e) => (
          <View style={{flexDirection: 'row', margin: 10, marginLeft: 20, marginRight: 20, padding: 10, backgroundColor: 'white', borderWidth: 2, borderRadius: 30, borderColor: 'black', shadowColor: 'black', shadowOffset: {width: 4, height: 3}}}>
            <Text>{e.item.item.name}</Text>
            <Pressable onPress={() => {

            }} style={{padding: 5, backgroundColor: 'red'}}>
              <TrashIcon width={16.4} height={16.4}/>
            </Pressable>
          </View>
        )}
      />
      <StyledButton style={{padding: 10}} onPress={() => setIsAssest(true)} text='Add Asset'/>
      <Pressable onPress={() => {(newPost.id === 'Create') ? addPost(newPost):updatePost(newPost)}} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} style={{backgroundColor: isHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
        <Text style={{margin: 10}}>{(newPost.id === 'Create') ? 'Create Post':'Edit Post'}</Text>
      </Pressable>
      { newPost.id !== 'Create' ?
        <Pressable onPress={() => deletePost(newPost.id)}>
          <Text>Delete Post</Text>
        </Pressable>:null
      }
    </>
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
  const [isMessageHover, setIsMessageHover] = useState<boolean>(false);
  const [isTechHover, setIsTechHover] = useState<boolean>(false);
  const [topHeight, setTopHeight] = useState<number>(0);
  const [bottomHeight, setBottomHeight] = useState<number>(0);

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
    <ScrollView style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <View onLayout={(e) => setTopHeight(e.nativeEvent.layout.height)}>
        <Header />
        <Text style={{marginLeft: 'auto', marginRight: 'auto', color: 'white'}}>Admin Panel</Text>
      </View>
      { selectedPost !== undefined ?
        <EditPost newPost={selectedPost} setNewPost={setSelectedPost} onBack={() => setSelectedPost(undefined)} />:
        <FlatList 
          data={posts}
          renderItem={(post) => (
            <AdminPostBlock post={post} setSelectedPost={setSelectedPost} />
          )}
          style={{height: height - bottomHeight - topHeight}}
        />
      }
      <View style={{flexDirection: 'row'}} onLayout={(e) => setBottomHeight(e.nativeEvent.layout.height)}>
        <View style={{width: width/2}}>
          <Pressable onHoverIn={() => setIsMessageHover(true)} onHoverOut={() => setIsMessageHover(false)} onPress={() => /*navigate('/admin/message')*/{}} style={{backgroundColor: isMessageHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>Messages</Text>
          </Pressable>
        </View>
        <View style={{width: width/2}}>
          <Pressable onHoverIn={() => setIsTechHover(true)} onHoverOut={() => setIsTechHover(false)} onPress={() => /*navigate('/admin/tech') */{}} style={{backgroundColor: isTechHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>Technologies</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}