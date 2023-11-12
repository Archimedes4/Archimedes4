import { useEffect, useRef, useState } from "react";
import { NativeSyntheticEvent, Pressable, TextInput, TextInputKeyPressEventData, Text, View, ScrollView, Keyboard } from "react-native";
import createUUID from "../ulti/createUUID";
import * as Clipboard from 'expo-clipboard';

function getPositionChar(position: number, text: textCharType[]): textCharType | undefined {
  if (position < text.length) {
    return text[position];
  } else {
    return undefined;
  }
}
function handeKeyDown(e: NativeSyntheticEvent<TextInputKeyPressEventData>, position: number, text: textCharType[]): {position: number, newText?: textCharType[]} {
  console.log(e.nativeEvent)
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
    if (position < text[text.length - 1].position) {
      const nextPosChar = getPositionChar(position + 1, text);
      if (posChar.line === nextPosChar.line) {
        return {position: position + 1, newText: [
          ...text.slice(0, position),
          {
            char: '',
            line: posChar.line + 1,
            linePosition: 0,
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
      return {position: position + 1, newText: [
        ...text.slice(0, position),
        {
          char: '',
          line: posChar.line + 1,
          linePosition: 0,
          position: position + 1,
          id: createUUID()
        },
        ...text.slice(position).flatMap((x) => {
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
  if (!["Shift", "Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Control", "Alt", "Meta"].includes(e.nativeEvent.key)) {
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
  let result: textCharType[] = []
  let position = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const lineArray = lines[index].split("");
    if (lineArray.length === 0) {
      result.push({
        char: '',
        line: index,
        linePosition: 0,
        position: position,
        id: createUUID()
      })
      position += 1;
    } else {
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

export default function TextEditor({text, onChangeText}:{text: string, onChangeText: (item: string) => void}) {
  const [position, setPosition] = useState<number>(0);
  const mainRef = useRef<TextInput>();
  const [textChar, setTextChar] = useState<textCharType[]>([{
    char: '',
    line: 0,
    linePosition: 0,
    position: 0,
    id: createUUID()
  }]);

  async function pasteItem() {
    let result = "";
    let lastLine = 0;
    for (let index = 0; index < textChar.length; index += 1) {
      result += textChar[index].char
      if (textChar[index].position === position) {
        result += await Clipboard.getStringAsync();
      }
      if (lastLine !== textChar[index].line) {
        result += "\n"
        lastLine += 1;
      }
    }
    setTextChar(convertTextToType(result));
  }

  useEffect(() => {
    let result = "";
    let lastLine = 0;
    for (let index = 0; index < textChar.length; index += 1) {
      result += textChar[index].char
      if (lastLine !== textChar[index].line) {
        result += "\n"
        lastLine += 1;
      }
    }
    onChangeText(result);
  }, [textChar])
  
  useEffect(() => {
    setTextChar(convertTextToType(text));
  }, [])

  return (
    <>
      <Pressable onPress={() => pasteItem()}>
        <Text>Paste</Text>
      </Pressable>
      <Pressable onPress={() => {
        mainRef.current.focus()
        setPosition(textChar[textChar.length - 1].position)
      }}>
        <ScrollView horizontal>
          <View>
            {Array.from(Array(textChar[textChar.length - 1].line + 1).keys()).map((_i, index) => (
              <View style={{flexDirection: "row"}}>
                <View style={{width: 20}}>
                  <Text>{index + 1}</Text>
                </View>
                {textChar.filter((e) => {return e.line === index}).map((char) => (
                  <Pressable key={char.id} style={{flexDirection: 'row'}} onPress={() => {setPosition(char.position)}}>
                    <Text selectable={false}>{char.char}</Text>
                    { (position === char.position) ?
                      <View style={{width: 10, height: 16, backgroundColor: colors[Math.floor(Math.random() * (5))]}}/>:null
                    }
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </Pressable>
      <TextInput ref={mainRef} multiline onKeyPress={(e) => {
        const result = handeKeyDown(e, position, textChar)
        setPosition(result.position);
        if (result.newText !== undefined) {
          setTextChar(result.newText)
        }
      }} style={{opacity: 0}}/>
    </>
  )
}
