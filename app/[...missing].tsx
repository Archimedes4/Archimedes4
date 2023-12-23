import React from 'react'
import { Redirect } from 'expo-router'

export default function missing() {
  return <Redirect href={'/'}/>
}