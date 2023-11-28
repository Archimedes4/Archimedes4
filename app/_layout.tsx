import { Dimensions } from 'react-native';
import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { Provider, useDispatch } from 'react-redux';
import { dimentionsSlice } from '../redux/dimentionsReducer';
import store from '../redux/store';
import { Slot } from "expo-router";

const firebaseConfig = {
  apiKey: "AIzaSyDdP7PccSIrlOVKzuqCahZAe5yyt_rmsQc",
  authDomain: "andrewmainellaabout.firebaseapp.com",
  projectId: "andrewmainellaabout",
  storageBucket: "andrewmainellaabout.appspot.com",
  messagingSenderId: "1004421973192",
  appId: "1:1004421973192:web:6dd2d30bf3b83c746f51fd",
  measurementId: "G-L1QQBJNL1Q"
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