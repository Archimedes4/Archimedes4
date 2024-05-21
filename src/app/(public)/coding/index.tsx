import { View, Text, FlatList, useColorScheme, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { loadingStateEnum } from '../../../Types'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import PostBlock from '../../../components/PostBlock'
import Header from '../../../components/Header'
import MarkdownCross from '../../../components/MarkdownCross'
import { listPosts } from '../../../redux/reducers/postsReducer'

export default function Coding() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [selectedPost, setSelectedPost] = useState<post | undefined>(undefined);
  const colorScheme = useColorScheme()
  const { postState, posts } = useSelector((state: RootState) => state.posts);

  async function loadPosts() {
    listPosts("Coding")
  }

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.classList.add('dark');
    }
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
        <View style={{flex: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={"large"}/>
          <Text style={{color: 'white', marginTop: 5}}>Loading</Text>
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
                    <PostBlock width={(width - 40)/2} item={item} onSelect={() => setSelectedPost(item.item)}/>
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