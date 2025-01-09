import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { View, Text, Platform, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MarkdownCross from '@components/MarkdownCross';
import Header from '@components/Header';
import { getPost } from '@redux/reducers/postsReducer';
import { RootState } from '@redux/store';
import { loadingStateEnum } from '@types';

export default function ViewPost() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [selectedPost, setSelectedPost] = useState<post | undefined>(undefined);
  const [postState, setPostState] = useState<loadingStateEnum>(loadingStateEnum.loading)
  const colorScheme = useColorScheme()
  const {id} = useGlobalSearchParams()
  const insets = useSafeAreaInsets()
  
  async function loadPost() {
    if (typeof id === "string") {
      const result = await getPost(id)
      if (result.result === loadingStateEnum.success) {
        setSelectedPost(result.data)
      }
      setPostState(result.result)
    }
  }

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.classList.add('dark');
    }
    loadPost()
  }, []); 

  if (postState === loadingStateEnum.loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }
  return (
    <View style={{width: width, height: height, backgroundColor: (colorScheme ===  "light") ? "white":"#0d1117", top: insets.top}}>
      <Header />
      <MarkdownCross markdown={selectedPost.content} assests={selectedPost.assests}/>
    </View>
  )
}