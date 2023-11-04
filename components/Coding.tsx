import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useNavigate } from 'react-router-native'

export default function Coding() {
  const navigate = useNavigate()
  return (
    <View>
      <Pressable onPress={() => navigate('/')}>
        <Text>Back</Text>
      </Pressable>
      <Text>Coding</Text>
      
    </View>
  )
}