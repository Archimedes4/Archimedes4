import { View, Text, Pressable, Linking } from 'react-native'
import React, { useState } from 'react'
import Header from './Header'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { TextInput } from 'react-native-paper';

export default function Contact() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [message, setMessage] = useState<string>("");
  return (
    <View style={{width: width, height: height}}>
      <Header />
      <Text>Message Write a message</Text>
      <TextInput multiline value={message} onChangeText={setMessage}/>
      <Pressable>
        <Text>Send</Text>
      </Pressable>
      <Pressable onPress={() => {Linking.openURL('mailto:andrewmainellacontact@gmail.com')}}>
        <Text>Write an email</Text>
      </Pressable>
      <Pressable onPress={() => {Linking.openURL('https://github.com/Archimedes4')}}>
        <Text>View on github</Text>
      </Pressable>
      <Text>If you are looking for my insta, x, etc... You won't find it, I don't use social media</Text>
    </View>
  )
}