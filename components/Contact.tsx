import { View, Text } from 'react-native'
import React from 'react'
import Header from './Header'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Contact() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View style={{width: width, height: height}}>
      <Header />

    </View>
  )
}