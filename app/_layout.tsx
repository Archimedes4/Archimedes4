/*
  Andrew Mainella About
  Andrew Mainella
  30 November 2023
*/
import { Dimensions, Platform, View } from 'react-native';
import React, { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { Provider, useDispatch } from 'react-redux';
import { dimentionsSlice } from '../redux/reducers/dimentionsReducer';
import store from '../redux/store';
import { Slot } from "expo-router";
import 'raf/polyfill';
import { getAuth } from 'firebase/auth';
import Head from "expo-router/head"
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(public)/index",
};

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

function AppCore() {

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window}) => {
        store.dispatch(dimentionsSlice.actions.setDimentionsHeight(window.height))
        store.dispatch(dimentionsSlice.actions.setDimentionsWidth(window.width))
      },
    );
    return () => subscription?.remove();
  });

  return (
    <Slot />
  );
}

export default function App() {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true)
  }, [])


  const [fontsLoaded] = useFonts({
    'Bungee-Regular': require('../assets/Bungee-Regular.ttf'),
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
        <View onLayout={onLayoutRootView}>
          <AppCore />
        </View>
      </Provider>
    </>
  );
}