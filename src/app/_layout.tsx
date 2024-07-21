/*
  Andrew Mainella About
  Andrew Mainella
  30 November 2023
*/
import { Dimensions, Platform, Pressable, View, useWindowDimensions, Text } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import { Provider, useDispatch } from 'react-redux';
import { dimentionsSlice } from '../redux/reducers/dimentionsReducer';
import store from '../redux/store';
import { Slot, router } from "expo-router";
import 'raf/polyfill';
import { getAuth } from 'firebase/auth';
import Head from "expo-router/head"
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIcon, CodingIcon, ContactIcon, GithubIcon, HomeIcon } from '../components/Icons';
import useNotificationHandler from '../hooks/useNotificationHandler';

SplashScreen.preventAutoHideAsync();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_APPID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENTID
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app)

export const db = getFirestore(app);

function AppCore() {
  useNotificationHandler()
  const {width, height} = useWindowDimensions();
  const isCollapsed = useMemo(() => {
    if (width <= 1000) {
      return true
    }
    return false
  }, [width])
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (isCollapsed) {
      store.dispatch(dimentionsSlice.actions.setDimentionsHeight(height - (60 + insets.bottom)))
    } else {
      store.dispatch(dimentionsSlice.actions.setDimentionsHeight(height))
    }
    store.dispatch(dimentionsSlice.actions.setDimentionsWidth(width))
  }, [width, height, isCollapsed]);

  return (
    <View style={{height}}>
      <Slot />
      {isCollapsed ?
        <View style={{height: 60 + insets.bottom, width, backgroundColor: '#00c0ff', zIndex: 2, position: 'absolute', bottom: 0, flexDirection: 'row', borderTopWidth: 3, borderColor: 'gray'}}>
          <Pressable
            style={{width: width/5, height: 60 + insets.bottom}}
            onPress={() => {
              router.push("/")
            }}
          >
            <HomeIcon width={40} height={40} style={{marginHorizontal: ((width/5) - 40)/2, marginVertical: 10}}/>
          </Pressable>
          <Pressable
            style={{width: width/5, height: 60 + insets.bottom}}
            onPress={() => {
              router.push("/coding")
            }}
          >
            <CodingIcon width={40} height={40} style={{marginHorizontal: ((width/5) - 40)/2, marginVertical: 10}}/>
          </Pressable>
          <Pressable
            style={{width: width/5, height: 60 + insets.bottom}}
            onPress={() => {
              router.push("/activities")
            }}  
          >
            <ActivityIcon width={40} height={40} style={{marginHorizontal: ((width/5) - 40)/2, marginVertical: 10}}/>
          </Pressable>
          <Pressable
            style={{width: width/5, height: 60 + insets.bottom}}
            onPress={() => {
              router.push("/admin")
            }}
          >
            <GithubIcon width={40} height={40} style={{marginHorizontal: ((width/5) - 40)/2, marginVertical: 10}}/>
          </Pressable>
          <Pressable
            style={{width: width/5, height: 60 + insets.bottom}}
            onPress={() => {
              router.push("/contact")
            }}
          >
            <ContactIcon width={40} height={40} style={{marginHorizontal: ((width/5) - 40)/2, marginVertical: 10}}/>
          </Pressable>
        </View>:null
      }
    </View>
  );
}

export default function App() {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true)
  }, [])


  const [fontsLoaded] = useFonts({
    'Bungee-Regular': require('../../assets/Bungee-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (Dimensions.get('window').width === 0 || !mounted) {
    return null
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Andrew Mainella</title>
      </Head>
      <Provider store={store}>
        <GestureHandlerRootView>
          <View onLayout={onLayoutRootView} style={{overflow: 'hidden'}}>
            <AppCore />
          </View>
        </GestureHandlerRootView>
      </Provider>
    </>
  );
}