/*
  Andrew Mainella
*/
import { router } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from '@components/Header'
import PostBlock from '@components/PostBlock';
import { RootState } from '@redux/store';
import { listPosts } from '@redux/reducers/postsReducer';
import { loadingStateEnum } from '@types';

export default function Activities() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const { postState, posts } = useSelector((state: RootState) => state.posts);
  const insets = useSafeAreaInsets()

  async function loadPosts() {
    await listPosts("Activities")
  }

  useEffect(() => {
    loadPosts();
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba", paddingTop: insets.top}}>
      <Header />
      <Text style={{fontSize: height * 0.1, fontFamily: 'Bungee-Regular', color: 'white', marginLeft: 20, width: width - 40}} numberOfLines={1} adjustsFontSizeToFit>Activities</Text>
      { (postState === loadingStateEnum.loading) ?
        <View style={{flex: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={"large"} color='white'/>
          <Text style={{color: 'white', marginTop: 5}}>Loading</Text>
        </View>:
        <>
          { (postState === loadingStateEnum.success) ?
            <FlatList 
              data={posts}
              renderItem={(item) => (
                <View style={{marginBottom: 20}}>
                  <PostBlock width={width * 0.9} item={item} onSelect={() => router.push(`/activities/${item.item.id}`)}/>
                </View>
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