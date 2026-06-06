/*
  Archimedes4
  Andrew Mainella
  _layout.tsx
  layout that sends user to login page is they are not authentcated.
*/
import React from 'react';
import { Redirect, Slot } from 'expo-router';
import LoadingComponent from '@components/LoadingComponent';
import useIsUserAuth from '@hooks/useIsUserAuth';

export default function _layout() {
  const { isLoading, isAdmin } = useIsUserAuth()
  
  if (isLoading) {
    return (
      <LoadingComponent />
    );
  }

  if (isAdmin) {
    return (
      <Slot />
    );
  }
  
  return <Redirect href='/login'/>;
}
