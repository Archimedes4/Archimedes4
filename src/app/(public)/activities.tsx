import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { loadingStateEnum } from '../../Types';
import MarkdownCross from '../../components/MarkdownCross';
import PostBlock from '../../components/PostBlock';
import { listPosts } from '../../redux/reducers/postsReducer';

export default function Activities() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [selectedPost, setSelectedPost] = useState<post | undefined>(undefined);
  const { postState, posts } = useSelector((state: RootState) => state.posts);

  async function loadPosts() {
    await listPosts("Activities")
  }

  useEffect(() => {
    loadPosts();
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header />
      { selectedPost !== undefined ?
        <MarkdownCross markdown={selectedPost.content} assests={selectedPost.assests} />:
        <>
          <Text style={{fontSize: height * 0.1, fontFamily: 'Bungee-Regular', color: 'white', marginLeft: 20}}>Activities</Text>
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
                      <PostBlock width={width * 0.9} item={item} onSelect={() => setSelectedPost(item.item)}/>
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