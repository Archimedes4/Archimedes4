import { View, Text, Platform, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import MarkdownCross from '../../../components/MarkdownCross';
import { useGlobalSearchParams } from 'expo-router';
import { getPost } from '../../../redux/reducers/postsReducer';
import { loadingStateEnum } from '../../../Types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Header from '../../../components/Header';

export default function ViewPost() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [selectedPost, setSelectedPost] = useState<post | undefined>(undefined);
  const [postState, setPostState] = useState<loadingStateEnum>(loadingStateEnum.loading)
  const colorScheme = useColorScheme()
  const {id} = useGlobalSearchParams()
  
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
    <View style={{width: width, height: height, backgroundColor: (colorScheme ===  "light") ? "white":"#0d1117"}}>
      <Header />
      <MarkdownCross markdown={selectedPost.content} assests={selectedPost.assests}/>
    </View>
  )
}