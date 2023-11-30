/*
  Andrew Mainella About
  Andrew Mainella
  30 November 2023
*/
import { Dimensions } from 'react-native';
import React, { useEffect } from "react";
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
  return (
    <Provider store={store}>
      <AppCore />
    </Provider>
  );
}