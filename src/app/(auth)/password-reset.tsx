import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import StyledButton from '../../components/StyledButton'
import { resetPassword } from '../../ulti/authenticationFunctions'
import { useGlobalSearchParams } from 'expo-router'

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