import { useGlobalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import StyledButton from '@components/StyledButton'
import { resetPassword } from '@functions/authenticationFunctions'

export default function passwordReset() {
  const [newPassword, setNewPassword] = useState<string>("")
  const { oobCode } = useGlobalSearchParams()
  if (typeof oobCode === 'string') {
    return (
      <View>
        <Text>Reset Password</Text>
        <TextInput value={newPassword} onChangeText={setNewPassword}/>
        <StyledButton text='Confirm' onPress={() => {resetPassword(oobCode, newPassword)}}/>
      </View>
    )
  }
  return (
    <View>
      <Text>Invalid Url</Text>
    </View>
  )
}