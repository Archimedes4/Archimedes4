import { View, Text, Pressable, FlatList, ListRenderItemInfo, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { listPosts } from '../ulti/postFunctions'
import { loadingStateEnum } from '../Types'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import PostBlock from './PostBlock'
import Header from './Header'
import MarkdownCross from './MarkdownCross'

export default function Coding() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [posts, setPosts] = useState<post[]>([]);
  const [postState, setPostState] = useState<loadingStateEnum>(loadingStateEnum.loading);
  const [selectedPost, setSelectedPost] = useState<post | undefined>(undefined);

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
      { selectedPost !== undefined ?
        <MarkdownCross markdown={selectedPost.content} />:
        <>
          { (postState === loadingStateEnum.loading) ?
            <View>
              <Text>Loading</Text>
            </View>:
            <>
              { (postState === loadingStateEnum.success) ?
                <FlatList 
                  data={posts}
                  renderItem={(item) => (
                    <PostBlock width={width * 0.9} height={height * 0.9} item={item} setPost={(e) => {
                      let newPosts = posts;
                      newPosts[item.index] = e
                      setPosts([...newPosts])
                    }} onSelect={() => setSelectedPost(item.item)}/>
                  )}
                />:
                <View>
                  <Text>Failed</Text>
                </View>
              }
            </>
          }
        </>
      }
    </View>
  )
}