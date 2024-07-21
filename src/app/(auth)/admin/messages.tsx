/*
  Archimedes4
  Andrew Mainella
  June 30 2024
*/

import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { loadingStateEnum } from '../../../Types';
import { listMessages } from '../../../ulti/messageFunctions';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderText from '../../../components/HeaderText';

export default function AdminMessages() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [messageState, setMessageState] = useState<loadingStateEnum>(loadingStateEnum.notStarted);
  const [messages, setMessages] = useState<message[]>([]);
  const insets = useSafeAreaInsets()

  async function loadMessages() {
    setMessageState(loadingStateEnum.loading)
    const result = await listMessages();
    if (result.result === loadingStateEnum.success) {
      setMessages(result.data);
      setMessageState(loadingStateEnum.success);
    } else {
      setMessageState(loadingStateEnum.failed);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba", paddingTop: insets.top, paddingBottom: insets.top}}>
      <Header/>
      <Pressable onPress={() => router.push("/admin")}>
        <Text>Back</Text>
      </Pressable>
      <HeaderText text='Admin Messages'/>
      <FlatList
        data={messages}
        renderItem={(message) => (
          <View style={{width: width - 30, marginHorizontal: 15, marginBottom: 15, padding: 5, borderWidth: 1, borderRadius: 4, backgroundColor: 'white'}}>
            <Text>{message.item.email !== '' ? message.item.email:'No Sender Provided'}</Text>
            <Text>{message.item.content}</Text>
          </View>
        )}
      />
    </View>
  )
}