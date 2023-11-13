import { Dimensions, View } from 'react-native';
import React, { useEffect, useState } from "react";
import Home from './components/Home';
import { NativeRouter, Route, Routes } from 'react-router-native';
import Activitys from './components/Activitys';
import Coding from './components/Coding';
import { initializeApp } from "firebase/app";
import AdminPanel from './components/AdminPanel';
import { Provider, useDispatch } from 'react-redux';
import { dimentionsSlice } from './redux/dimentionsReducer';
import store from './redux/store';
import Contact from './components/Contact';
import AdminTechnologies from './components/AdminTechnologies';
import AdminMessages from './components/AdminMessages';

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
    <View>
      <NativeRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/coding' element={<Coding />} />
          <Route path='/activities' element={<Activitys />}/>
          <Route path='/admin' element={<AdminPanel />}/>
          <Route path='/admin/tech' element={<AdminTechnologies />}/>
          <Route path='/admin/message' element={<AdminMessages />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='*' element={<Home />}/>
        </Routes>
      </NativeRouter>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppCore />
    </Provider>
  );
}