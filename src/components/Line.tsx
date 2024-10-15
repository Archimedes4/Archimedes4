import { View, Text, Pressable } from 'react-native';
import React, { useMemo, useState } from 'react';
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { getOffset } from '../ulti/editorFunctions';

function Row({
  text,
  carrotOppacity,
  position,
  offset,
  setPosition,
  isBold
}: {
  text: string;
  carrotOppacity: SharedValue<number>;
  position: number;
  offset: number;
  setPosition: (position: number) => void;
  isBold: boolean
}) {
  const textArr = useMemo(() => {return text.split("")}, [text])

  const carrotStyle = useAnimatedStyle(() => {
    return {
      opacity: carrotOppacity.value
    }
  })
  
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
            <View style={{height: 15, width: 1, backgroundColor: 'red', position: 'absolute', right: 0}}/>:null
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
  carrotOppacity,
  offset,
  setPosition,
  numberWidth
}:{
  text: string;
  line: number;
  position: number;
  carrotOppacity: SharedValue<number>;
  offset: number;
  setPosition: (position: number) => void;
  numberWidth: number;
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
    <View style={{flexDirection: 'row', backgroundColor: 'gray'}} onLayout={(e) => {setWidth(e.nativeEvent.layout.width)}}>
      <Text style={{width: numberWidth}}>{line + ": " }</Text>
      <View>
        {(position === (offset - 1)) ?
          <View style={{height: 15, width: 2, backgroundColor: 'red', position: 'absolute', zIndex: 2}}/>:null
        }
        {rowArr.map((t, i) => (
          <Row text={t} carrotOppacity={carrotOppacity} position={position} offset={offset + getOffset(i, rowArr) - i} setPosition={setPosition} isBold={isBold}/>
        ))}
      </View>
    </View>
  )
}