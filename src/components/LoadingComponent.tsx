import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

export default function LoadingComponent() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba", justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color={'white'} size={'large'}/>
      <Text style={{marginTop: 15, color: 'white'}}>Loading...</Text>
    </View>
  )
}