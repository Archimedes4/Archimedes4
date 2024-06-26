import { useEffect, useRef, useState } from "react";
import { NativeSyntheticEvent, Pressable, TextInput, TextInputKeyPressEventData, Text, View, ScrollView, Keyboard, Platform } from "react-native";
import createUUID from "../ulti/createUUID";
import * as Clipboard from 'expo-clipboard';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";

function getPositionChar(position: number, text: textCharType[]): textCharType | undefined {
  if (position < text.length) {
    return text[position];
  } else {
    return undefined;
  }
}

async function handeKeyDown(e: NativeSyntheticEvent<TextInputKeyPressEventData>, position: number, text: textCharType[]): Promise<{ position: number; newText?: textCharType[]; }> {
  if (e.nativeEvent.key === "ArrowRight") {
    if (text[text.length - 1].position > position) {
      return {position: position + 1}
    } else {
      return {position: position}
    }
  } else if (e.nativeEvent.key === "ArrowLeft") {
    if (position - 1 > 0) {
      return {position: position - 1}
    } else {
      return {position: 0}
    }
  } else if (e.nativeEvent.key === "ArrowDown") {
    const positionChar = getPositionChar(position, text);
    if (positionChar !== undefined) {
      //Next line exists and is long enough
      const charOnNextLine = text.find((x) => {return x.line === positionChar.line + 1 && x.linePosition === positionChar.linePosition});
      if (charOnNextLine !== undefined) {
        return {position: charOnNextLine.position}
      }
      //Next Line Exisits
      const nextLine = text.filter((x) => {return x.line === positionChar.line + 1});
      if (nextLine.length >= 1) {
        return {position: nextLine[nextLine.length - 1].position}
      }
      //End
      return {position: text.length - 1}
    }
  } else if (e.nativeEvent.key === "ArrowUp") {
    const positionChar = getPositionChar(position, text);
    if (positionChar !== undefined) {
      //Prev line exists and is long enough
      const charOnPrevLine = text.find((x) => {return x.line === positionChar.line - 1 && x.linePosition === positionChar.linePosition});
      if (charOnPrevLine !== undefined) {
        return {position: charOnPrevLine.position}
      }
      //Prev Line Exisits
      const prevLine = text.filter((x) => {return x.line === positionChar.line - 1});
      if (prevLine.length >= 1) {
        return {position: prevLine[prevLine.length - 1].position}
      }
      //End
      return {position: 0}
    }
  }
  if (e.nativeEvent.key === "Backspace") {
    if (position - 1 >= 0) {
      const posChar = getPositionChar(position, text);
      if (posChar !== undefined) {
        if (posChar.linePosition === 0) {
          let oldLinePosition = 0;
          return {position: position - 1, newText: [
            ...text.slice(0, position).map((x) => {
              if (x.line === posChar.line - 1) {
                oldLinePosition = x.linePosition
              }
              return x
            }),
            ...text.slice(position + 1).flatMap((x) => {
              if (x.line === posChar.linePosition) {
                return {...x,  position: x.position - 1, line: x.line - 1, linePosition: x.linePosition - 1};
              }
              return {...x,  position: x.position - 1, line: x.line - 1};
            })
          ]}
        }
        return {position: position - 1, newText: [
          ...text.slice(0, position),
          ...text.slice(position + 1).flatMap((x) => {
            if (x.line === posChar.linePosition) {
              return {...x,  position: x.position - 1, linePosition: x.linePosition - 1};
            }
            return {...x,  position: x.position - 1};
          })
        ]}
      }
    }
    return {position: position};
  }
  if (e.nativeEvent.key === "Enter") {
    const posChar = getPositionChar(position, text);
    //If not at end
    if (position < text[text.length - 1].position) {
      const nextPosChar = getPositionChar(position + 1, text);
      //Check 
      //At start of the line
      if (posChar.linePosition === 0) {
        return {position: position + 1, newText: [
          ...text.slice(0, position),
          {
            char: '',
            line: posChar.line,
            linePosition: 0,
            position: position,
            id: createUUID()
          },
          ...text.slice(position).flatMap((x) => {
            if (x.line === posChar.line) {
              return {...x, linePosition: x.linePosition - posChar.linePosition, line: x.line + 1, position: x.position + 1}
            }
            return {...x,  position: x.position + 1, line: x.line + 1}
          })
        ]}
        //If midway through line
      } else if (posChar.line === nextPosChar.line) {
        return {position: position + 1, newText: [
          ...text.slice(0, position + 1),
          {
            char: '',
            line: posChar.line + 1,
            linePosition: 0,
            position: position + 1,
            id: createUUID()
          },
          ...text.slice(position + 1).flatMap((x) => {
            if (x.line === posChar.line) {
              return {...x, linePosition: x.linePosition - posChar.linePosition, line: x.line + 1, position: x.position + 1}
            }
            return {...x,  position: x.position + 1}
          })
        ]}
      }
      console.error("End of line")
      //at end of line
      return {position: position + 1, newText: [
        ...text.slice(0, position + 1),
        {
          char: '',
          line: posChar.line + 1,
          linePosition: 0,
          position: position + 1,
          id: createUUID()
        },
        ...text.slice(position + 1).flatMap((x) => {
          return {...x, line: x.line + 1, position: x.position + 1}
        })
      ]}
    }
    return {position: position + 1, newText: [
      ...text,
      {
        char: "",
        line: posChar.line + 1,
        linePosition: 0,
        position: position + 1,
        id: createUUID()
      },
    ]}
  }
  if (e.nativeEvent.key === "Tab") {
    const posChar = getPositionChar(position, text);
    if (posChar !== undefined) {
      return {position: position + 1, newText: [
        ...text.slice(0, position),
        {
          char: '\t',
          line: posChar.line,
          linePosition: posChar.linePosition + 1,
          position: position + 1,
          id: createUUID()
        },
        ...text.slice(position).flatMap((x) => {
          if (x.line === posChar.line) {
            return {...x, linePosition: x.linePosition + 1, position: x.position + 1}
          }
          return {...x,  position: x.position + 1}
        })
      ]}
    }
  }
  // @ts-expect-error metaKey exists on web
  if (Platform.OS === 'web' && e.nativeEvent.key === 'v' && e.metaKey === true) {
    const clipboard = await Clipboard.getStringAsync();
    let newPosition = position;
    let newText = [...text]
    for (let index = 0; index < clipboard.length; index += 1) {  
      const posChar = getPositionChar(newPosition, newText);
      if (posChar !== undefined) {
        newPosition += 1
        newText = [
          ...newText.slice(0, newPosition + 1),
          {
            char: clipboard.at(index),
            line: posChar.line,
            linePosition: posChar.linePosition + 1,
            position: newPosition + 1,
            id: createUUID()
          },
          ...newText.slice(newPosition + 1).flatMap((x) => {
            if (x.line === posChar.line) {
              return {...x, linePosition: x.linePosition + 1, position: x.position + 1}
            }
            return {...x,  position: x.position + 1}
          })
        ]
      }
    }
    console.log("Here", newText)
    return ({
      position: newPosition,
      newText
    })
  } else if (!["Shift", "Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Control", "Alt", "Meta"].includes(e.nativeEvent.key)) {
    const posChar = getPositionChar(position, text);
    if (posChar !== undefined) {
      return {position: position + 1, newText: [
        ...text.slice(0, position + 1),
        {
          char: e.nativeEvent.key,
          line: posChar.line,
          linePosition: posChar.linePosition + 1,
          position: position + 1,
          id: createUUID()
        },
        ...text.slice(position + 1).flatMap((x) => {
          if (x.line === posChar.line) {
            return {...x, linePosition: x.linePosition + 1, position: x.position + 1}
          }
          return {...x,  position: x.position + 1}
        })
      ]}
    }
  }
  return {position: position}
}

function convertTextToType(text: string): textCharType[] {
  const lines = text.split(/\r?\n|\r|\n/g);
  let result: textCharType[] = [{
    char: '',
    line: 0,
    linePosition: 0,
    position: 0,
    id: createUUID()
  }]
  let position = 1;
  for (let index = 0; index < lines.length; index += 1) {
    const lineArray = lines[index].split("");
    if (lineArray.length === 0 && position !== 1) {
      result.push({
        char: '',
        line: index,
        linePosition: 0,
        position: position,
        id: createUUID()
      })
      position += 1;
    } else {
      if (index !== 0) {
        result.push({
          char: '',
          line: index,
          linePosition: 0,
          position: position,
          id: createUUID()
        })
        position += 1;
      }
      for (let charIndex = 0; charIndex < lineArray.length; charIndex += 1) {
        result.push({
          char: lineArray[charIndex],
          line: index,
          linePosition: charIndex,
          position: position,
          id: createUUID()
        })
        position += 1;
      }
    }
  }
  return result;
}

type textCharType = {
  char: string
  line: number //First position is zero
  linePosition: number // First position is zero
  position: number //First position is zero
  id: string
}

const colors:string[] = ["red","blue","green","yellow","orange"]

export default function TextEditor({text, onChangeText, height}:{text: string, onChangeText: (item: string) => void; height: number}) {
  const [position, setPosition] = useState<number>(0);
  const carrotOppacity = useSharedValue(1);
  const mainRef = useRef<TextInput>();
  const horizontalScroll = useRef<ScrollView>();
  const [textChar, setTextChar] = useState<textCharType[]>([{
    char: '',
    line: 0,
    linePosition: 0,
    position: 0,
    id: createUUID()
  }]);

  async function pasteItem() {
    const clipboard = await Clipboard.getStringAsync();
    let result = "";
    let lastLine = 0;
    for (let index = 0; index < textChar.length; index += 1) {
      result += textChar[index].char
      if (textChar[index].position === position) {
        result += clipboard
      }
      if (lastLine !== textChar[index].line) {
        result += "\n"
        lastLine += 1;
      }
    }
    setTextChar(convertTextToType(result));
  }

  const carrotStyle = useAnimatedStyle(() => {
    return {
      opacity: carrotOppacity.value
    }
  })

  useEffect(() => {
    let result = "";
    for (let index = 1; index < textChar.length; index += 1) {
      if (textChar[index].char === "") {
        result += "\n"
      } else {
        result += textChar[index].char
      }
    }
    onChangeText(result);
  }, [textChar])
  
  useEffect(() => {
    setTextChar(convertTextToType(text));
    carrotOppacity.value = withRepeat(withSequence(withDelay(650, withTiming(0, {
      duration: 0
    })), withDelay(500, withTiming(1, {
      duration: 0
    }))), -1);
  }, [])

  useEffect(() => {
    const result = getPositionChar(position, textChar)
    if (result !== undefined) {
      horizontalScroll.current.scrollTo({
        x: result.position * 2
      })
    }
  }, [position])

  return (
    <View style={{marginHorizontal: 20, shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 10, backgroundColor: 'white'}}>
      <View style={{borderBottomColor: 'black',borderBottomWidth: 1}}>
        <Pressable onPress={() => pasteItem()}>
          <Text>Paste</Text>
        </Pressable>
      </View>
      <Pressable onPress={(e) => {
        if (!mainRef.current?.isFocused()) {
          e.preventDefault()
          mainRef.current.focus()
        }
        setPosition(textChar[textChar.length - 1].position)
      }}>
        <ScrollView ref={horizontalScroll} horizontal style={{backgroundColor: 'white', padding: 4, height}}>
          <View>
            {Array.from(Array(textChar[textChar.length - 1].line + 1).keys()).map((i, index) => (
              <View key={i} style={{flexDirection: "row"}}>
                <View style={{width: 20}}>
                  <Text>{index + 1}</Text>
                </View>
                {textChar.filter((e) => {return e.line === index}).map((char) => (
                  <Pressable focusable={false} key={char.id} style={{flexDirection: 'row'}} onPress={(e) => {
                    e.preventDefault()
                    setPosition(char.position);
                    if (!mainRef.current?.isFocused()) {
                      mainRef.current.focus();
                    }
                  }}>
                    <Text selectable={false}>{char.char}</Text>
                    { (position === char.position && mainRef.current?.isFocused()) ?
                      <Animated.View style={[ carrotStyle, {position: 'absolute', right: 0, width: 1.5, height: 16.4, backgroundColor: 'gray'}]}/>:null
                    }
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </Pressable>
      <TextInput ref={mainRef} multiline onKeyPress={async (e) => {
        e.preventDefault()
        const result = await handeKeyDown(e, position, textChar)
        setPosition(result.position);
        if (result.newText !== undefined) {
          setTextChar(result.newText)
        }
      }} style={{opacity: 0, height: 0}}/>
    </View>
  )
}
