import React from 'react'
import { Text } from 'react-native'
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

export default function HeaderText({text}:{text: string}) {
  const {height} = useSelector((state: RootState) => state.dimentions);
  return (
    <Text style={{fontSize: height * 0.1, fontFamily: 'Bungee-Regular', color: 'white', marginHorizontal: 20, textAlign: 'center'}} adjustsFontSizeToFit numberOfLines={1}>{text}</Text>
  )
}