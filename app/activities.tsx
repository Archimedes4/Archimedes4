import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { loadingStateEnum } from '../Types';
import MarkdownCross from '../components/MarkdownCross';
import PostBlock from '../components/PostBlock';
import { listPosts } from '../ulti/postFunctions';

export default function Activities() {
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
      { selectedPost !== undefined ?
        <MarkdownCross markdown={selectedPost.content} />:
        <>
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
                    <View style={{marginBottom: 20}}>
                      <PostBlock width={width * 0.9} height={height * 0.4} item={item} setPost={(e) => {
                        let newPosts = posts;
                        newPosts[item.index] = e
                        setPosts([...newPosts])
                      }} onSelect={() => setSelectedPost(item.item)}/>
                    </View>
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