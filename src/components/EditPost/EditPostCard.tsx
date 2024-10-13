import { View, Text, ScrollView, Modal, Pressable, TextInput, FlatList, Switch, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import SelectFile from '../SelectFile'
import Header from '../Header'
import StyledButton from '../StyledButton'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useRouter } from 'expo-router'
import SVGXml from '../SVGXml'
import { listTechnologies } from '../../ulti/technologyFunctions'
import { loadingStateEnum } from '../../Types'
import UpdatePostButton from './UpdatePostButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Head from 'expo-router/head'

// Is Card is always turn in this view
export default function EditPostCard({
  newPost,
  setIsCard,
  setNewPost,
  onEditPostSuccess,
  hasChanged
}:{
  newPost: post
  setIsCard: (item: boolean) => void,
  setNewPost: (item: post) => void,
  onEditPostSuccess: () => void,
  hasChanged: boolean
}) {
  const [isPickingCover, setIsPickingCover] = useState<boolean>(false);
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const router = useRouter() 
  const [technologies, setTechnologies] = useState<technology[]>([]);
  const [techState, setTechState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [coverImageHeight, setCoverImageHeight] = useState<number>(100);
  const insets = useSafeAreaInsets()

  async function loadTechnologies() {
    const result = await listTechnologies();
    if (result.result === loadingStateEnum.success) {
      setTechnologies(result.data);
      setTechState(loadingStateEnum.success);
    } else {
      setTechState(loadingStateEnum.failed);
    }
  }

  async function getCoverImageHeight(uri: string) {
    Image.getSize(uri, (imgWidth, imgHeight) => {
      setCoverImageHeight(imgHeight/imgWidth * (width - 36));
    });
  }
  
  useEffect(() => {
    loadTechnologies();
  }, [])

  return (
    <View style={{height, width}}>
      <Head>
        <title>Edit Post</title>
      </Head>
      <ScrollView style={{width: width, height: height, backgroundColor: "#1c93ba"}} contentContainerStyle={{paddingTop: insets.top}} nestedScrollEnabled>
        <Modal visible={isPickingCover}>
          <SelectFile selectedFile={newPost.cover} onClose={() => {setIsPickingCover(false)}} onSelect={(e) => {setNewPost({...newPost, cover: e})}}/>
        </Modal>
        <Header />
        <StyledButton onPress={() => {router.push("/admin")}} text='Back' textStyle={{margin: 10}} style={{width: width - 40, marginLeft: 'auto', marginRight: 'auto'}}/>
        <View style={{width: width-40, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginLeft: 'auto', marginRight: 'auto'}}>
          <Pressable onPress={() => setIsCard(true)} style={{backgroundColor: '#d3d3d3', width: width/2-20}}>
            <Text style={{margin: 10}}>Card</Text>
          </Pressable>
          <Pressable onPress={() => setIsCard(false)} style={{backgroundColor: 'white', width: width/2-20}}>
            <Text style={{margin: 10}}>Blog</Text>
          </Pressable>
        </View>
        <View style={{width: width-40, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginLeft: 'auto', marginRight: 'auto'}}>
          <Pressable onPress={() => {
            setNewPost({
              ...newPost,
              type: "Coding"
            })
          }} style={{backgroundColor: (newPost.type === "Coding") ? '#d3d3d3':'white', width: width/2-20}}>
            <Text style={{margin: 10}}>Coding</Text>
          </Pressable>
          <Pressable onPress={() => {
            setNewPost({
              ...newPost,
              type: "Activities"
            })
          }} style={{backgroundColor:  (newPost.type === "Activities") ? '#d3d3d3':'white', width: width/2-20}}>
            <Text style={{margin: 10}}>Activities</Text>
          </Pressable>
        </View>
        <View style={{margin: 5}}>
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <View style={{margin: 5, marginTop: 10}}>
              <Text>Title</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.title} onChangeText={(e) => setNewPost({...newPost, title: e})}/>
              <Text>Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.url} onChangeText={(e) => {setNewPost({...newPost, url: e})}}/>
              <Text>Status</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.status} onChangeText={(e) => {setNewPost({...newPost, status: e})}}/>
              <Text>Github Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 8, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.githubUrl} onChangeText={(e) => {setNewPost({...newPost, githubUrl: e})}}/>
            </View>
          </View>
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10, overflow: 'hidden'}}>
            {newPost.cover.name !== '' ?
              <>
                {newPost.cover.loadingState ===loadingStateEnum.success ?
                  <Image source={{uri: newPost.cover.url}} onLayout={(e) => {
                    if (newPost.cover.loadingState === loadingStateEnum.success) {
                      getCoverImageHeight(newPost.cover.url) 
                    }
                  }} style={{ width: width - 35, height: coverImageHeight }}/>:
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
                    setNewPost({...newPost, technologies: [...newPost.technologies.filter((r) => {return r.id !== e.item.id})]})
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
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 10, margin: 10, flexDirection: 'row'}}>
            <Text style={{fontSize: 15, marginTop: 'auto', marginBottom: 'auto'}}>Hidden: </Text>
            <Switch value={newPost.hidden} onValueChange={(e) => {
              setNewPost({
                ...newPost,
                hidden: e
              })
            }}/>
          </View>
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 10, margin: 10, flexDirection: 'row'}}>
            <Text>Title Hidden: </Text>
            <Switch value={newPost.hiddenTitle} onValueChange={(e) => {
              setNewPost({
                ...newPost,
                hiddenTitle: e
              })
            }}/>
          </View>
          <UpdatePostButton newPost={newPost} setNewPost={setNewPost} onEditPostSuccess={onEditPostSuccess} hasChanged={hasChanged}/>
        </View>
      </ScrollView>
    </View>
  )
}