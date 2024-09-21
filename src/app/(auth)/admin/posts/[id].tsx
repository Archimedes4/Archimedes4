/*
  Archimedes4
  Andrew Mainella
  July 19 2024
*/
import MarkdownCross from '../../../../components/MarkdownCross';
import TextEditor from '../../../../components/TextEditor';
import StyledButton from '../../../../components/StyledButton';
import { MoreHIcon, MoreVIcon, TrashIcon } from '../../../../components/Icons';
import SelectFile from '../../../../components/SelectFile';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useEffect, useState } from 'react';
import { loadingStateEnum } from '../../../../Types';
import { Pressable, View, Text, Modal, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { deletePost, getPost } from '../../../../ulti/postFunctions';
import { getAssest } from '../../../../ulti/storageFunctions';
import { router, useGlobalSearchParams } from 'expo-router';
import Header from '../../../../components/Header';
import EditPostCard from '../../../../components/EditPost/EditPostCard';
import UpdatePostButton from '../../../../components/EditPost/UpdatePostButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkIfUnsaved } from '../../../../ulti/checkIfUnsaved';

export default function EditPost() {
  //View
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [isAssest, setIsAssest] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isCard, setIsCard] = useState<boolean>(true);
  const [isNavHidden, setIsNavHidden] = useState<boolean>(false);
  const { id } = useGlobalSearchParams();
  const [newPost, setNewPost] = useState<post>()
  const [loadPostState, setLoadPostState] = useState<loadingStateEnum>(loadingStateEnum.notStarted)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true)
  const insets = useSafeAreaInsets()
  const [originalPost, setOriginalPost] = useState<post>(undefined)

  async function loadCover() {
    setNewPost({...newPost, cover: {...newPost.cover, loadingState: loadingStateEnum.loading}})
    const result = await getAssest(newPost.cover.name);
    if (result.result === loadingStateEnum.success) {
      setNewPost({...newPost, cover: {...newPost.cover, loadingState: loadingStateEnum.success, url: result.data}})
      setLoadPostState(loadingStateEnum.success)
    } else {
      setNewPost({...newPost, cover: {...newPost.cover, loadingState: loadingStateEnum.failed}})
      setLoadPostState(loadingStateEnum.success) // Yes the cover failed post didn't
    }
  }


  async function loadPost() {
    setLoadPostState(loadingStateEnum.loading)
    if (typeof id === 'string' && id !== 'create') {
      const result = await getPost(id);
      if (result.result === loadingStateEnum.success) {
        setNewPost(result.data)
        setOriginalPost(result.data)
      } else {
        setLoadPostState(result.result)
      }
    } else if (typeof id === 'string' && id === 'create') {
      setNewPost({
        title: 'Create New Post',
        cover: {
          name: '',
          fileType: '',
          id: '',
          loadingState: loadingStateEnum.failed
        },
        content: '',
        assests: [],
        updated: '',
        type: 'Coding',
        id: 'Create',
        status: 'inProgress',
        url: '',
        technologies: [],
        githubUrl: '',
        views: [],
        hidden: true,
        hiddenTitle: false
      })
      setLoadPostState(loadingStateEnum.success)
    } else {
      setLoadPostState(loadingStateEnum.failed)
    }
  }

  useEffect(() => {
    if (newPost === undefined || originalPost === undefined || newPost.id === 'Create') {
      return
    }
    setHasUnsavedChanges(checkIfUnsaved(originalPost, newPost))
    console.log(checkIfUnsaved(originalPost, newPost))
  }, [newPost])

  useEffect(() => {
    if (newPost !== undefined && newPost.cover.loadingState === loadingStateEnum.notStarted) {
      loadCover();
    }
  }, [newPost?.cover]);

  useEffect(() => {
    loadPost()
  }, [])

  if (loadPostState === loadingStateEnum.loading) {
    return (
      <View style={{width, height, justifyContent: 'center', alignItems: 'center', backgroundColor: "#1c93ba"}}>
        <ActivityIndicator color={'white'} size={'large'}/>
        <Text style={{marginTop: 5, color: 'white'}}>Loading...</Text>
      </View>
    )
  }

  if (isCard && loadPostState === loadingStateEnum.success) {
    return <EditPostCard newPost={newPost} setIsCard={setIsCard} setNewPost={setNewPost} onEditPostSuccess={() => {
      setHasUnsavedChanges(false)
      setOriginalPost(newPost)
    }} hasChanged={hasUnsavedChanges}/>
  }

  if (loadPostState === loadingStateEnum.success) {
    return (
      <View style={{height}}>
        <ScrollView style={{width: width, height: height, backgroundColor: "#1c93ba"}} contentContainerStyle={{paddingTop: insets.top}}>
          <Modal visible={isAssest}>
            <SelectFile selectedFile={newPost.cover} onClose={() => {setIsAssest(false)}} onSelect={(e) => {setNewPost({...newPost, assests: [...newPost.assests, {
              item: e,
              id: newPost.assests.length.toString()
            }]})}}/>
          </Modal>
          <Header />
          {!isNavHidden ?
            <>
              <StyledButton onPress={() => {router.push("/admin")}} text='Back' textStyle={{margin: 10}} style={{width: width - 40, marginLeft: 'auto', marginRight: 'auto'}}/>
              <View style={{width: width-40, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginHorizontal: 20}}>
                <Pressable onPress={() => setIsCard(true)} style={{backgroundColor: isCard ? '#d3d3d3':'white', width: (width-40)/2}}>
                  <Text style={{margin: 10}}>Card</Text>
                </Pressable>
                <Pressable onPress={() => setIsCard(false)} style={{backgroundColor: isCard ? 'white':'#d3d3d3', width: (width-40)/2}}>
                  <Text style={{margin: 10}}>Blog</Text>
                </Pressable>
              </View>
            </>:null
          }
          <View style={{flexDirection: "row"}}>
            <View style={{width: width-96.4, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginHorizontal: 20}}>
              <Pressable onPress={() => setIsPreview(false)} style={{backgroundColor: isPreview ? 'white':'#d3d3d3', width: width/2-48.2}}>
                <Text style={{margin: 10}}>Code</Text>
              </Pressable>
              <Pressable onPress={() => setIsPreview(true)} style={{backgroundColor: !isPreview ? 'white':'#d3d3d3', width: width/2-48.2}}>
                <Text style={{margin: 10}}>Preview</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => {setIsNavHidden(!isNavHidden)}} style={{width: 36.4, height: 36.4, borderRadius: 30, marginRight: 20, backgroundColor: 'white', marginTop: 10, shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 2, borderColor: 'black'}}>
              {isNavHidden ?
                <MoreHIcon width={10} height={10} style={{margin: 11.2}}/>:<MoreVIcon width={10} height={10} style={{margin: 11.2}}/>
              }
            </Pressable>
          </View>
          {isPreview ?
            <MarkdownCross markdown={newPost.content} assests={newPost.assests}/>:
            <TextEditor text={newPost.content} onChangeText={(e) => {setNewPost({...newPost, content: e})}} height={height}/>
          }
          <Text style={{marginLeft: 20, color: "white"}}>Assests</Text>
          <FlatList
            data={newPost.assests}
            renderItem={(e) => (
              <View style={{flexDirection: 'row', margin: 10, backgroundColor: 'white', borderWidth: 2, borderRadius: 30, borderColor: 'black', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, overflow: 'hidden'}}>
                <Text style={{margin: 10}} selectable={false}>{e.item.item.name}</Text>
                <Pressable onPress={() => {
                  setNewPost({
                    ...newPost,
                    assests: [...newPost.assests.filter((r) => {return r.id !== e.item.id})],
                  })
                }} style={{backgroundColor: 'red', marginLeft: 'auto'}}>
                  <TrashIcon width={16.4} height={16.4} style={{ marginTop: 'auto', marginBottom: 'auto', paddingLeft: 10, paddingRight: 5 }}/>
                </Pressable>
              </View>
            )}
          />
          <StyledButton style={{padding: 10}} onPress={() => setIsAssest(true)} text='Add Asset'/>
          <UpdatePostButton newPost={newPost} setNewPost={setNewPost} onEditPostSuccess={() => {
            setHasUnsavedChanges(false)
            setOriginalPost(newPost)
          }}
            hasChanged={hasUnsavedChanges}
          />
          { newPost.id !== 'Create' ?
            <StyledButton style={{padding: 10}} onPress={() => deletePost(newPost.id)} text='Delete Post'/>:null
          }
        </ScrollView>
      </View>
    )
  }
  return (
    <View>
      <Text>Failed</Text>
    </View>
  )
}