import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Header from './Header'

export default function AdminMessages() {
  return (
    <View>
      <Header/>
      <Pressable>
        <Text>Back</Text>
      </Pressable>
      <Text>AdminMessages</Text>
    </View>
  )
}