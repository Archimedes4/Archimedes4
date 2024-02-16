import { View, Text, Pressable, FlatList, ListRenderItemInfo, Image } from 'react-native'
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

  async function loadPosts() {
    const result = await listPosts(false)
    if (result.result === loadingStateEnum.success) {
      console.log(result.data)
      setPosts(result.data);
      setPostState(loadingStateEnum.success)
    } else {
      setPostState(loadingStateEnum.failed)
    }
  }

  useEffect(() => {
    loadPosts();
  }, [])

  if (selectedPost !== undefined) {
    return (
      <View style={{width: width, height: height, backgroundColor: "white"}}>
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
              renderItem={(item) => {
                if (item.item.hidden) {
                  return null
                }
                return (        
                  <View style={{marginBottom: 20}}>
                    <PostBlock width={width * 0.9} height={height * 0.4} item={item} setPost={(e) => {
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