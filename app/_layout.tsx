/*
  Andrew Mainella About
  Andrew Mainella
  30 November 2023
*/
import { Dimensions, Platform } from 'react-native';
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { Provider, useDispatch } from 'react-redux';
import { dimentionsSlice } from '../redux/dimentionsReducer';
import store from '../redux/store';
import { Slot } from "expo-router";
import 'raf/polyfill';

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
};

export const app = initializeApp(firebaseConfig);

function AppCore() {
  const dispatch = useDispatch()
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window}) => {
        dispatch(dimentionsSlice.actions.setDimentionsHeight(window.height))
        dispatch(dimentionsSlice.actions.setDimentionsWidth(window.width))
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
  if (Dimensions.get('window').width === 0 || !mounted) {
    return null
  }
  return (
    <Provider store={store}>
      <AppCore />
    </Provider>
  );
}