import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { loadingStateEnum } from '../Types';
import MarkdownCross from '../components/MarkdownCross';
import PostBlock from '../components/PostBlock';
import { listPosts } from '../ulti/postFunctions';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

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


  const [fontsLoaded] = useFonts({
    'Bungee-Regular': require('../assets/Bungee-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}} onLayout={onLayoutRootView}>
      <Header />
      { selectedPost !== undefined ?
        <MarkdownCross markdown={selectedPost.content} />:
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