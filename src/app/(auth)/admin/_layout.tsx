/*
  Archimedes4
  Andrew Mainella
  _layout.tsx
  layout that sends user to login page is they are not authentcated.
*/
import React from 'react'
import { Redirect, Slot } from 'expo-router'
import useIsUserAuth from '../../../hooks/useIsUserAuth'
import { ActivityIndicator, View } from 'react-native'

export default function _layout() {
  const { isLoading, isUserAuth } = useIsUserAuth()
  
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  if (isUserAuth) {
    return (
      <Slot />
    )
  }
  return <Redirect href='/login'/>
}