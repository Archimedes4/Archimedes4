import { View, Text, ScrollView, Modal, Pressable, TextInput, FlatList, Switch, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import SelectFile from '../SelectFile'
import Header from '../Header'
import StyledButton from '../StyledButton'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useRouter } from 'expo-router'
import SVGXml from '../SVGXml'
import { addPost, updatePost } from '../../ulti/postFunctions'
import { listTechnologies } from '../../ulti/technologyFunctions'
import { loadingStateEnum } from '../../Types'
import UpdatePostButton from './UpdatePostButton'

export default function EditPostCard({
  newPost,
  isCard,
  setIsCard,
  setNewPost
}:{
  newPost: post
  isCard: boolean,
  setIsCard: (item: boolean) => void,
  setNewPost: (item: post) => void
}) {
  const [isPickingCover, setIsPickingCover] = useState<boolean>(false);
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const router = useRouter() 
  const [technologies, setTechnologies] = useState<technology[]>([]);
  const [techState, setTechState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [coverImageHeight, setCoverImageHeight] = useState<number>(100);

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
    <ScrollView style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Modal visible={isPickingCover}>
        <SelectFile selectedFile={newPost.cover} onClose={() => {setIsPickingCover(false)}} onSelect={(e) => {setNewPost({...newPost, cover: e})}}/>
      </Modal>
      <Header />
      <StyledButton onPress={() => {router.push("/admin")}} text='Back' textStyle={{margin: 10}} style={{width: width - 40, marginLeft: 'auto', marginRight: 'auto'}}/>
      <View style={{width: width-40, borderRadius:50, flexDirection: 'row', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto', margin: 10, marginLeft: 'auto', marginRight: 'auto'}}>
        <Pressable onPress={() => setIsCard(true)} style={{backgroundColor: isCard ? '#d3d3d3':'white', width: width/2-20}}>
          <Text style={{margin: 10}}>Card</Text>
        </Pressable>
        <Pressable onPress={() => setIsCard(false)} style={{backgroundColor: isCard ? 'white':'#d3d3d3', width: width/2-20}}>
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
        {(newPost.id === 'Create') ?
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 10, margin: 10, flexDirection: 'row'}}>
            <Text>Hidden: </Text>
            <Switch value={newPost.hidden} onValueChange={(e) => {
              setNewPost({
                ...newPost,
                hidden: e
              })
            }}/>
          </View>:
          <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 10, margin: 10, flexDirection: 'row'}}>
            <Text>Hidden: </Text>
            <Switch value={newPost.hidden} onValueChange={(e) => {
              setNewPost({
                ...newPost,
                hidden: e
              })
            }}/>
          </View>
        }
        <UpdatePostButton newPost={newPost} setNewPost={setNewPost}/>
      </View>
    </ScrollView>
  )
}