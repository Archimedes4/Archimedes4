import { View, Text, Pressable } from 'react-native'
import React, { useMemo, useState } from 'react'

function Row({
  text
}: {
  text: string
}) {
  const textArr = useMemo(() => {return text.split("")}, [text])
  return (
    <View style={{flexDirection: 'row'}}>
      {textArr.map((e) => (
        <Pressable>
          <Text>{e}</Text>
        </Pressable>
      ))}
    </View>
  )
}

export default function Line({
  text,
  line
}:{
  text: string
  line: number
}) {
  const [width, setWidth] = useState<number>(0)
  const rowArr: string[] = useMemo(() => {
    // TODO testing
    let charPerLine = Math.floor(width/6.5)
    let result: string[] = []
    // TODO fix the Math.floor ..
    console.log(text.length/charPerLine, text.length)
    for (let index = 0; index < (Math.floor(text.length/charPerLine) + 1); index += 1) {
      console.log(charPerLine * index, (charPerLine * (index + 1)))
      result.push(text.substring(charPerLine * index, (charPerLine * (index + 1))))
    }
    return result
  
  }, [text, width])
  return (
    <View style={{flexDirection: 'row', backgroundColor: 'gray'}} onLayout={(e) => {setWidth(e.nativeEvent.layout.width)}}>
      <Text style={{width: 15}}>{line + ": " }</Text>
      <View>
        {rowArr.map((t) => (
          <Row text={t}/>
        ))}
      </View>
    </View>
  )
}