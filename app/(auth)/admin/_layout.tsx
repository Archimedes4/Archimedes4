import { View, Text } from 'react-native'
import React from 'react'
import { isUserAdmin } from '../../../ulti/authenticationFunctions'
import { Redirect, Slot } from 'expo-router'

export default function _layout() {
  if (isUserAdmin()) {
    return (
      <Slot />
    )
  }
  return <Redirect href='/login'/>
}