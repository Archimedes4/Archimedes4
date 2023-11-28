import { View, Text } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Activities() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header />
      <Text>Activities</Text>
    </View>
  )
}