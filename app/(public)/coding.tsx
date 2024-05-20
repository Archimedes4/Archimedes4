import { View, Text, Pressable, FlatList, ListRenderItemInfo, Image, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { listPosts } from '../../ulti/postFunctions'
import { loadingStateEnum } from '../../Types'
import { useSelector } from 'react-redux'
import store, { RootState } from '../../redux/store'
import PostBlock from '../../components/PostBlock'
import Header from '../../components/Header'
import MarkdownCross from '../../components/MarkdownCross'

export default function Coding() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [posts, setPosts] = useState<post[]>([]);
  const [postState, setPostState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [selectedPost, setSelectedPost] = useState<post | undefined>(undefined);
  const colorScheme = useColorScheme()

  async function loadPosts() {
    const result = await listPosts(false, "Coding")
    if (result.result === loadingStateEnum.success) {
      console.log(result.data)
      setPosts(result.data);
      setPostState(loadingStateEnum.success)
    } else {
      setPostState(loadingStateEnum.failed)
    }
  }

  useEffect(() => {
      document.body.classList.add('dark');
  }, []); 

  useEffect(() => {
    loadPosts();
  }, [])

  if (selectedPost !== undefined) {
    return (
      <View style={{width: width, height: height, backgroundColor: (colorScheme ===  "light") ? "white":"#0d1117"}}>
        <Header />
        <MarkdownCross markdown={selectedPost.content} assests={selectedPost.assests}/>
      </View>
    )
  }

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header />
      <Text style={{fontSize: height * 0.1, fontFamily: 'Bungee-Regular', color: 'white', marginLeft: 20}}>Coding</Text>
      { (postState === loadingStateEnum.loading) ?
        <View>
          <Text>Loading</Text>
        </View>:
        <>
          { (postState === loadingStateEnum.success) ?
            <FlatList 
              data={posts}
              numColumns={2}
              renderItem={(item) => {
                if (item.item.hidden) {
                  return null
                }
                return (        
                  <View style={{margin: 10, marginBottom: 20}} key={item.item.id}>
                    <PostBlock width={width * 0.45} item={item} setPost={(e) => {
                      let newPosts = posts;
                      newPosts[item.index] = e
                      setPosts([...newPosts])
                    }} onSelect={() => setSelectedPost(item.item)}/>
                  </View>
                )
              }}
            />:
            <View>
              <Text>Failed</Text>
            </View>
          }
        </>
      }
    </View>
  )
}