import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { getAuth } from "firebase/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <View>
      <Text>AdminLogin</Text>
      <TextInput value={email} onChangeText={setEmail}/>
      <TextInput value={password} onChangeText={setPassword}/>
      <Pressable>
        <Text style={{margin: 10}}>Login</Text>
      </Pressable>
    </View>
  )
}