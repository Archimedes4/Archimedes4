import { View, Text, Pressable, FlatList, ListRenderItemInfo, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-native'
import { listPosts } from '../ulti/postFunctions'
import { loadingStateEnum } from '../Types'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import PostBlock from './PostBlock'
import Header from './Header'

export default function Coding() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [posts, setPosts] = useState<post[]>([]);
  const [postState, setPostState] = useState<loadingStateEnum>(loadingStateEnum.loading);

  async function loadPosts() {
    const result = await listPosts()
    if (result.result === loadingStateEnum.success) {
      setPosts(result.data);
      setPostState(loadingStateEnum.success)
    } else {
      setPostState(loadingStateEnum.failed)
    }
  }

  useEffect(() => {
    loadPosts();
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header />
      <Text>Coding</Text>
      { (postState === loadingStateEnum.loading) ?
        <View>
          <Text>Loading</Text>
        </View>:
        <>
          { (postState === loadingStateEnum.success) ?
            <FlatList 
              data={posts}
              renderItem={(item) => (
                <PostBlock item={item} setPost={(e) => {
                  let newPosts = posts;
                  newPosts[item.index] = e
                  setPosts([...newPosts])
                }}/>
              )}
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