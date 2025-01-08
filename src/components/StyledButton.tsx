import React, { useState } from 'react'
import { Text, Pressable, TextStyle } from 'react-native'

declare global {
  type StyledButtonPropsText = {
    text: string,
    textStyle?: TextStyle | undefined,
    style?: TextStyle | undefined,
    onPress?: () => void,
    children?: undefined
  }
  type StyledButtonPropsComponent = {
    children: React.ReactNode,
    style?: TextStyle | undefined,
    onPress?: () => void
    text?: undefined,
    textStyle?: undefined
  }
  
  type StyledButtonProps = StyledButtonPropsText | StyledButtonPropsComponent
}

export default function StyledButton({children, text, textStyle, style, onPress}:StyledButtonProps) {
  const [isHover, setIsHover] = useState<boolean>(false)
  if (children != undefined) {
    return (
      <Pressable onPress={() => {
        onPress()
      }} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} onPressIn={() => setIsHover(true)} onPressOut={() => setIsHover(false)} style={[{backgroundColor: isHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}, style]}>
        {children}
      </Pressable>
    )
  }
  return (
    <Pressable onPress={() => {
      onPress()
    }} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} onPressIn={() => setIsHover(true)} onPressOut={() => setIsHover(false)} style={[{backgroundColor: isHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}, style]}>
      <Text style={textStyle}>{text}</Text>
    </Pressable>
  )
}