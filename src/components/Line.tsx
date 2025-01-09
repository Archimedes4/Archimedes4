/*
  Archimedes4
  Andrew Mainella
  Line.tsx
  January 9 2024
  Holds the text for a line.
*/
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { getCharWidth, getOffset } from '@functions/editorFunctions';

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
          key={`POS_${offset + number}`}
          style={{flexDirection: 'row'}}
          focusable={false}
          onPress={() => setPosition(offset + number)}
        >
          <Text style={{fontWeight: isBold ? 'bold':'normal'}} selectable={false}>{e}</Text>
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
    console.log(width)
    if (text.length === 0 || width === 0) {
      return [""]
    }
    console.log(text)
    // TODO testing
    let result: string[] = []
    // TODO fix the Math.floor ..
    let line = "";
    let lineWidth = 0;
    for (let index = 0; index < text.length; index += 1) {
      const charWidth = getCharWidth(text[index]);
      lineWidth += charWidth;
      if (lineWidth > (width - 19.5)) {
        result.push(line);
        line = text[index];
        lineWidth = charWidth;
      } else {
        line += text[index];
      }
    }
    if (line !== "") {
      result.push(line);
    }
    return result
  
  }, [text, width])

  return (
    <View style={{flexDirection: 'row'}} onLayout={(e) => {
      console.log(e.nativeEvent.layout.width)
      setWidth(e.nativeEvent.layout.width)}}>
      <Text style={{width: numberWidth}}>{line + ": " }</Text>
      <View>
        {(position === (offset - 1)) ?
          <Caret caretOppacity={caretOppacity} isFocused={isFocused} left/>:null
        }
        {rowArr.map((t, i) => (
          <Row  key={`Line_${offset}_Row_${i}`} text={t} caretOppacity={caretOppacity} position={position} offset={offset + getOffset(i, rowArr) - i} setPosition={setPosition} isBold={isBold} isFocused={isFocused}/>
        ))}
      </View>
    </View>
  )
}