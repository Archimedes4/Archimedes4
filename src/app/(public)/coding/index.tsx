import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { loadingStateEnum } from '../../../Types'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import PostBlock from '../../../components/PostBlock'
import Header from '../../../components/Header'
import { listPosts } from '../../../redux/reducers/postsReducer'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import createUUID from '../../../ulti/createUUID'

export default function Coding() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const { postState, posts } = useSelector((state: RootState) => state.posts);
  const insets = useSafeAreaInsets()

  async function loadPosts() {
    listPosts("Coding")
  }

  useEffect(() => {
    loadPosts();
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba", paddingTop: insets.top}}>
      <Header />
      <Text style={{fontSize: height * 0.1, fontFamily: 'Bungee-Regular', color: 'white', marginHorizontal: 20, textAlign: 'center'}}>Coding</Text>
      { (postState === loadingStateEnum.loading) ?
        <View style={{flex: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={"large"}/>
          <Text style={{color: 'white', marginTop: 5}}>Loading</Text>
        </View>:
        <>
          { (postState === loadingStateEnum.success) ?
            <FlatList 
              key={(width < 576) ? ("1" + createUUID()):("2" + createUUID())}
              data={posts}
              numColumns={(width < 576) ? 1:2}
              renderItem={(item) => {
                if (item.item.hidden) {
                  return null
                }
                return (        
                  <View style={{margin: 10, marginBottom: 20}} key={item.item.id}>
                    <PostBlock width={(width - 40)/((width < 576) ? 1:2)} item={item} onSelect={() => router.push(`/coding/${item.item.id}`)}/>
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