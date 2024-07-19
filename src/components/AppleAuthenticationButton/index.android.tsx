import { Pressable, View } from 'react-native'
import React from 'react'
import { signInWithApple } from '../../functions/AuthenticationFunctions'
import { SignInWithApple } from '../Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

export default function AppleAuthenticationButton() {
  const { width } = useSelector((state: RootState) => state.dimensions)
  return (
    <Pressable
      style={{backgroundColor: "black", width: (width * ((width <= 560) ? 0.95:0.8)) - 20, height: 40, paddingHorizontal: 16.8, borderRadius: 6,  alignItems: 'center'}}
      onPress={() => {
        signInWithApple()
      }}
    >
        <SignInWithApple width={176.4} height={40}/>
    </Pressable>
  )
}