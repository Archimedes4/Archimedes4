import { View, Text, Pressable } from 'react-native';
import React, { useMemo, useState } from 'react';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { getOffset } from '../ulti/editorFunctions';

function Caret({
  caretOppacity,
  left,
  isFocused
}:{
  caretOppacity: SharedValue<number>;
  isFocused: boolean;
  left?: boolean
}) {
  const caretStyle = useAnimatedStyle(() => {
    return {
      opacity: caretOppacity.value
    }
  })

  if (!isFocused) {
    return null
  }

  return (
    <Animated.View style={[{height: 18, width: 1, position: 'absolute', right: (left === true) ? undefined:-1, left: (left === true) ? 1:undefined, backgroundColor: 'gray'}, caretStyle]}/>
  )
}

function Row({
  text,
  caretOppacity,
  position,
  offset,
  setPosition,
  isBold,
  isFocused
}: {
  text: string;
  caretOppacity: SharedValue<number>;
  position: number;
  offset: number;
  setPosition: (position: number) => void;
  isBold: boolean;
  isFocused: boolean;
}) {
  const textArr = useMemo(() => {return text.split("")}, [text])
  
  return (
    <View style={{flexDirection: 'row'}}>
      {textArr.map((e, number) => (
        <Pressable
          style={{flexDirection: 'row'}}
          focusable={false}
          onPress={() => setPosition(offset + number)}
        >
          <Text style={{fontWeight: isBold ? 'bold':'normal'}}>{e}</Text>
          {(position === (offset + number)) ?
            <Caret caretOppacity={caretOppacity} isFocused={isFocused}/>:null
          }
        </Pressable>
      ))}
    </View>
  )
}

export default function Line({
  text,
  line,
  position,
  caretOppacity,
  offset,
  setPosition,
  numberWidth,
  isFocused
}:{
  text: string;
  line: number;
  position: number;
  caretOppacity: SharedValue<number>;
  offset: number;
  setPosition: (position: number) => void;
  numberWidth: number;
  isFocused: boolean;
}) {
  const [width, setWidth] = useState<number>(0)
  const isBold = useMemo(() => {
    return text.startsWith("# ") || text.startsWith("## ") || text.startsWith("### ")
  }, [text])

  const rowArr: string[] = useMemo(() => {
    if (text.length === 0 || width === 0) {
      return [""]
    }
    // TODO testing
    let charPerLine = Math.floor(width/6.5)
    let result: string[] = []
    // TODO fix the Math.floor ..
    console.log(charPerLine, (Math.floor(text.length/charPerLine) + 1))
    for (let index = 0; index < (Math.floor(text.length/charPerLine) + 1); index += 1) {
      console.log(charPerLine * index, (charPerLine * (index + 1)))
      result.push(text.substring(charPerLine * index, (charPerLine * (index + 1))))
    }
    return result
  
  }, [text, width])

  return (
    <View style={{flexDirection: 'row'}} onLayout={(e) => {setWidth(e.nativeEvent.layout.width)}}>
      <Text style={{width: numberWidth}}>{line + ": " }</Text>
      <View>
        {(position === (offset - 1)) ?
          <Caret caretOppacity={caretOppacity} isFocused={isFocused} left/>:null
        }
        {rowArr.map((t, i) => (
          <Row text={t} caretOppacity={caretOppacity} position={position} offset={offset + getOffset(i, rowArr) - i} setPosition={setPosition} isBold={isBold} isFocused={isFocused}/>
        ))}
      </View>
    </View>
  )
}