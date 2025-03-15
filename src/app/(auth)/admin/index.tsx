/*
  Archimedes4 pulled from Ultimate Tic Tac Toe
  Andrew Mainella

*/
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from '@components/Header';
import HeaderText from '@components/HeaderText';
import { listPosts } from '@functions/postFunctions';
import { RootState } from '@redux/store';
import { loadingStateEnum } from '@types';

function AdminPostBlock({post}:{post: ListRenderItemInfo<post>}) {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <Pressable onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} key={post.item.id} onPress={() => router.push(`/admin/posts/${post.item.id}`)} style={{backgroundColor: isHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
      <Text style={{marginLeft: 10, marginRight: 'auto', marginTop: 10, marginBottom: 10}}>{post.item.title}</Text>
    </Pressable>  
  )
}

export default function AdminPanel() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [posts, setPosts] = useState<post[]>([]);
  const [isMessageHover, setIsMessageHover] = useState<boolean>(false);
  const [isTechHover, setIsTechHover] = useState<boolean>(false);
  const [topHeight, setTopHeight] = useState<number>(0);
  const [bottomHeight, setBottomHeight] = useState<number>(0);
  const insets = useSafeAreaInsets()

  async function loadPost() {
    const result = await listPosts(true);
    if (result.result === loadingStateEnum.success) {
      setPosts([...result.data, {
        title: 'Create New Post',
        cover: {
          name: '',
          id: '',
          fileType: '',
          loadingState: loadingStateEnum.failed
        },
        content: '',
        assests: [],
        updated: '',
        type: 'Coding',
        id: 'create',
        status: 'inProgress',
        url: '',
        technologies: [],
        githubUrl: '',
        views: [],
        hidden: true,
        hiddenTitle: false
      }])
    }
  }

  useEffect(() => {
    loadPost()
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba", paddingTop: insets.top, paddingBottom: (width <= 500) ? 0:insets.bottom}}>
      <View onLayout={(e) => setTopHeight(e.nativeEvent.layout.height)}>
        <Header />
        <HeaderText text='Admin Dashboard'/>
      </View>
      <FlatList 
        data={posts}
        renderItem={(post) => (
          <AdminPostBlock post={post} />
        )}
        style={{height: height - bottomHeight - topHeight - (width > 500 ? insets.bottom:0) - insets.top}}
      />
      <View style={{flexDirection: 'row'}} onLayout={(e) => setBottomHeight(e.nativeEvent.layout.height)}>
        <View style={{width: width/2}}>
          <Pressable onHoverIn={() => setIsMessageHover(true)} onHoverOut={() => setIsMessageHover(false)} onPress={() => router.push('/admin/messages')} style={{backgroundColor: isMessageHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>Messages</Text>
          </Pressable>
        </View>
        <View style={{width: width/2}}>
          <Pressable onHoverIn={() => setIsTechHover(true)} onHoverOut={() => setIsTechHover(false)} onPress={() => router.push('/admin/technologies')} style={{backgroundColor: isTechHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
            <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>Technologies</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}