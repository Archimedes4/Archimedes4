import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { loadingStateEnum } from '../../../Types';
import MarkdownCross from '../../../components/MarkdownCross';
import PostBlock from '../../../components/PostBlock';
import { listPosts } from '../../../redux/reducers/postsReducer';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        <View>
          <ActivityIndicator />
          <Text>Loading</Text>
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