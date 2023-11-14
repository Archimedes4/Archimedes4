import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-native';
import { loadingStateEnum } from '../Types';
import { listMessages } from '../ulti/messageFunctions';

export default function AdminMessages() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const navigate = useNavigate();
  const [messageState, setMessageState] = useState<loadingStateEnum>(loadingStateEnum.notStarted);
  const [messages, setMessages] = useState<message[]>([]);

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
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header/>
      <Pressable onPress={() => navigate("/admin")}>
        <Text>Back</Text>
      </Pressable>
      <Text>AdminMessages</Text>
      <FlatList
        data={messages}
        renderItem={(message) => (
          <View>
            <Text>{message.item.email !== '' ? message.item.email:'No Sender Provided'}</Text>
            <Text>{message.item.content}</Text>
          </View>
        )}
      />
    </View>
  )
}