import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Modal, Pressable, TextInput, Switch, Image } from 'react-native'
import { useSelector } from 'react-redux'
import SelectFile from '@components/SelectFile'
import Header from '@components/Header'
import StyledButton from '@components/StyledButton'
import { RootState } from '@redux/store'
import SVGXml from '@components/SVGXml'
import { listTechnologies } from '@functions/technologyFunctions'
import { loadingStateEnum } from '@types'
import UpdatePostButton from './UpdatePostButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Head from 'expo-router/head'
import { ChevronLeft, GlassesIcon, ImagePlusIcon, TrashIcon } from '@components/Icons'

function EditPostImage({
  newPost,
  setIsPickingCover,
  viewWidth
}:{
  newPost: post
  setIsPickingCover: (item: boolean) => void
  viewWidth: number
}) {
  const [coverImageHeight, setCoverImageHeight] = useState<number>(100);

  async function getCoverImageHeight(uri: string) {
    Image.getSize(uri, (imgWidth, imgHeight) => {
      setCoverImageHeight(imgHeight/imgWidth * viewWidth);
    });
  }

  return (
    <>
      {newPost.cover.name !== '' ?
        <>
          {newPost.cover.loadingState ===loadingStateEnum.success ?
            <Image source={{uri: newPost.cover.url}} onLayout={(e) => {
              if (newPost.cover.loadingState === loadingStateEnum.success) {
                getCoverImageHeight(newPost.cover.url) 
              }
            }} style={{ width: viewWidth, height: coverImageHeight }}/>:
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
        <View style={{height: viewWidth * 0.5, width: viewWidth, justifyContent: 'center'}}>
          <View>
            <Text style={{margin: 'auto', textAlign: 'center'}}>No cover has been selected!</Text>
            <Pressable style={{
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 5,
              margin: 5,
              width: 150,
              marginLeft: 'auto',
              marginRight: 'auto',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2
            }}
            onPress={() => {setIsPickingCover(true)}}>
              <ImagePlusIcon width={25} height={25}/>
              <Text style={{marginLeft: 3}}>Select Image</Text>
            </Pressable>
          </View>
        </View>
      }
      {newPost.cover.name !== '' ?
        <>
          <Pressable style={{margin: 5, position: 'absolute', width: 35, height: 35, left: 10, bottom: 10, backgroundColor: 'white', borderRadius: 35, alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black'}}>
            <GlassesIcon width={25} height={25}/>
          </Pressable>
          <Pressable style={{margin: 5, position: 'absolute', width: 35, height: 35, right: 10, bottom: 10, backgroundColor: 'white', borderRadius: 35, alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'black'}} onPress={() => setIsPickingCover(true)}>
            <ImagePlusIcon width={25} height={25}/>
          </Pressable>
        </>:null
      }
    </>
  )
}

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
        {(width <= 1000) ?
          <Header />:null
        }
        <View>
          <StyledButton onPress={() => {router.push("/admin")}} style={{width: width - 40, marginLeft: 'auto', marginRight: 'auto'}}>
            <ChevronLeft width={25} height={25} style={{margin: 10, marginVertical: 5, marginRight: 3}}/>
            <View style={{height: 'auto', justifyContent: 'center'}}>
              <Text style={{marginVertical: 0}}>Back</Text>
            </View>
          </StyledButton>
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
        </View>
        <View style={{margin: 5}}>
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, paddingVertical: 10, margin: 10, flexDirection: 'row'}}>
            { (width >= 576) ?
              <View style={{width: width * 0.3, borderRadius: 30, borderWidth: 5, margin: 10, overflow: 'hidden', marginVertical: 'auto'}}>
                <EditPostImage newPost={newPost} setIsPickingCover={setIsPickingCover} viewWidth={(width * 0.3) - 10}/>
              </View>:null
            }
            <View style={{margin: 5, marginTop: 10, width:  (width >= 576) ? (width - ((width * 0.3) + 70)):(width - 45) }}>
              <Text style={{marginLeft: 5}}>Title</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.title} onChangeText={(e) => setNewPost({...newPost, title: e})}/>
              <Text style={{marginLeft: 5}}>Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.url} onChangeText={(e) => {setNewPost({...newPost, url: e})}}/>
              <Text style={{marginLeft: 5}}>Status</Text>
              <TextInput style={{marginTop: 2, marginBottom: 4, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.status} onChangeText={(e) => {setNewPost({...newPost, status: e})}}/>
              <Text style={{marginLeft: 5}}>Github Url</Text>
              <TextInput style={{marginTop: 2, marginBottom: 8, padding: 5, borderColor: 'black', borderWidth: 2, borderRadius: 15}} value={newPost.githubUrl} onChangeText={(e) => {setNewPost({...newPost, githubUrl: e})}}/>
            </View>
          </View>
          { (width < 576) ?
            <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10, overflow: 'hidden'}}>
              <EditPostImage newPost={newPost} setIsPickingCover={setIsPickingCover} viewWidth={width - 35}/>
            </View>:null 
          }
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{margin: 5, marginTop: 10}}>Technologies</Text>
            <ScrollView style={{marginBottom: 15}}>
              {technologies.map((e) => (
                <Pressable
                  key={e.id}
                  onPress={() => {
                    const index = newPost.technologies.findIndex((x) => {return x.id === e.id});
                    if (index !== -1) {
                      setNewPost({...newPost, technologies: [...newPost.technologies.filter((r) => {return r.id !== e.id})]})
                    } else {
                      setNewPost({...newPost, technologies: [...newPost.technologies, e]})
                    }
                  }}
                  style={{backgroundColor: newPost.technologies.some((x) => {return x.id === e.id}) ? '#d3d3d3':'white', flexDirection: 'row', margin: 2, padding: 5, borderRadius: 15}}
                >
                  <SVGXml xml={e.content} width={20} height={20}/>
                  <Text>{e.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
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
            <Text style={{marginTop: 'auto', marginBottom: 'auto'}}>Title Hidden: </Text>
            <Switch value={newPost.hiddenTitle} onValueChange={(e) => {
              setNewPost({
                ...newPost,
                hiddenTitle: e
              })
            }}/>
          </View>
          <UpdatePostButton newPost={newPost} setNewPost={setNewPost} onEditPostSuccess={onEditPostSuccess} hasChanged={hasChanged}/>
          { newPost.id !== 'Create' ?
            <StyledButton style={{padding: 10}} onPress={() => {}}>
              <TrashIcon width={16.4} height={16.4} style={{ marginTop: 'auto', marginBottom: 'auto', paddingRight: 5 }}/>
              <Text>Delete Post</Text>
            </StyledButton>:null
          }
        </View>
      </ScrollView>
    </View>
  )
}