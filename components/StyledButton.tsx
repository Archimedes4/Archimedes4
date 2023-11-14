import { View, Text, Pressable, TextStyle } from 'react-native'
import React, { useState } from 'react'

export default function StyledButton({text, textStyle, style, onPress}:{text: string, textStyle?: TextStyle | undefined, style?: TextStyle | undefined, onPress?: () => void}) {
  const [isHover, setIsHover] = useState<boolean>(false)
  return (
    <Pressable onPress={() => onPress()} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} style={[{backgroundColor: isHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}, style]}>
      <Text style={textStyle}>{text}</Text>
    </Pressable>
  )
}