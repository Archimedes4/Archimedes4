import { Redirect } from 'expo-router'
import React from 'react'

export default function missing() {
  return <Redirect href={'/'}/>
}