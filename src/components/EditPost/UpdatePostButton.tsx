import React, { useState } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { addPost, updatePost } from '@functions/postFunctions';
import { loadingStateEnum } from '@types';

export default function UpdatePostButton({
  newPost,
  setNewPost,
  hasChanged
}:{
  newPost: post;
  setNewPost: (item: post) => void
  onEditPostSuccess: () => void,
  hasChanged: boolean
}) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<loadingStateEnum>(loadingStateEnum.notStarted)

  async function onPress() {
    setCurrentState(loadingStateEnum.loading)
    if (currentState === loadingStateEnum.failed || currentState === loadingStateEnum.notStarted) {
      if (newPost.id === "Create") {
        const result = await addPost(newPost)
        if (result.result === loadingStateEnum.success) {
          setNewPost({
            ...newPost,
            id: result.id
          })
          setCurrentState(loadingStateEnum.success)
        } else {
          setCurrentState(loadingStateEnum.failed)
        }
      } else {
        const result = await updatePost(newPost)
        if (result === loadingStateEnum.success) {
          setCurrentState(loadingStateEnum.success)
        } else {
          setCurrentState(loadingStateEnum.failed)
        }
      }
    }
  }

  if (hasChanged === false) {
    return (
      <View style={{backgroundColor: 'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
        <Text style={{margin: 10}}>This Post Is Up To Date</Text>
      </View>
    )
  }

  return (
    <Pressable onPress={() => {onPress()}} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} style={{backgroundColor: isHover ? '#d3d3d3':'white', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 'auto', margin: 10}}>
      {currentState === loadingStateEnum.loading ?
        <ActivityIndicator />:null
      }
      {currentState !== loadingStateEnum.loading ?
        <Text style={{margin: 10}}>{(newPost.id === 'Create') ? 'Create Post':'Edit Post'}</Text>:null
      }
    </Pressable>
  )
}