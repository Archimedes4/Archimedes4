import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Header from './Header'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-native';

export default function AdminMessages() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const navigate = useNavigate();
  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header/>
      <Pressable onPress={() => navigate("/admin")}>
        <Text>Back</Text>
      </Pressable>
      <Text>AdminMessages</Text>
    </View>
  )
}