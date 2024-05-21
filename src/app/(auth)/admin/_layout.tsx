/*
  Archimedes4
  Andrew Mainella
  _layout.tsx
  layout that sends user to login page is they are not authentcated.
*/
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