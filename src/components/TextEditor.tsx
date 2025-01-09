/*
  Andrew Mainella
*/
import * as Clipboard from 'expo-clipboard';
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, TextInput, View, ScrollView} from "react-native";
import { useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated";
import Line from "@components/Line";
import { cursorAbove, cursorBelow, deleteText, getNumberWidth, getOffset, insertText } from "@functions/editorFunctions";

const NOT_ALLOWED_KEYS = ["Shift", "CapsLock", "Alt", "Control", "Meta", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Dead"]

export default function TextEditor({text, onChangeText, height}:{text: string, onChangeText: (item: string) => void; height: number}) {
  const [position, setPosition] = useState<number>(-1);
  const caretOppacity = useSharedValue(1);
  const mainRef = useRef<TextInput>();
  const textArr = useMemo(() => {return text.split("\n")}, [text]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function updateOpacity() {
    caretOppacity.value = withSequence(withTiming(0, {
      duration: 100
    }), withDelay(100, withTiming(1, {duration: 100})))
  };

  useEffect(() => {
    const unsub = setInterval(() => {
      updateOpacity()
    }, 800);
    return () => {
      clearInterval(unsub)
    }
  }, []);

  return (
    <View style={{
      marginHorizontal: 20,
      shadowColor: 'black',
      shadowOffset: {width: 4, height: 3},
      borderWidth: 3,
      borderColor: 'black',
      borderRadius: 30,
      padding: 10,
      backgroundColor: 'white'
    }}>
      <Pressable onPress={(e) => {
        if (!mainRef.current?.isFocused()) {
          e.preventDefault()
          mainRef.current.focus()
        }
      }}>
        <ScrollView style={{padding: 4, height}}>
          <View>
            {textArr.map((e, number) => (
              <Line
                key={`Line_${number}`}
                text={e}
                line={number}
                position={position}
                caretOppacity={caretOppacity}
                offset={getOffset(number, textArr)}
                setPosition={(e) => {
                  setPosition(e)
                  mainRef.current.focus()
                }}
                numberWidth={getNumberWidth(textArr.length)}
                isFocused={isFocused}
              />
            ))}
          </View>
          <TextInput ref={mainRef} multiline onKeyPress={async (e) => {
            e.preventDefault()
            const key = e.nativeEvent.key
            // @ts-expect-error
            if (e.nativeEvent.metaKey === true && key === "v") {
              const clip = await Clipboard.getStringAsync()
              onChangeText(insertText(clip, text, position))
              setPosition(position + clip.length)
            } else if (key === "ArrowRight") {
              if (position < text.length - 1) {
                setPosition(position + 1)
              }
            } else if (key === "ArrowLeft") {
              if (position > -1) {
                setPosition(position - 1)
              }
            } else if (key === "ArrowUp") {
              setPosition(cursorAbove(text, position))
            } else if (key === "ArrowDown") {
              setPosition(cursorBelow(text, position))
            } else if (e.nativeEvent.key === "Backspace") {
              onChangeText(deleteText(text, position + 1))
              if (position > -1) {
                setPosition(position - 1)
              }
            } else if (e.nativeEvent.key === "Enter") {
              onChangeText(insertText("\n", text, position))
              setPosition(position + 1)
            } else if (e.nativeEvent.key === "Tab") {
              onChangeText(insertText("  ", text, position))
              setPosition(position + 2)
            } else if (!NOT_ALLOWED_KEYS.includes(key)) {
              onChangeText(insertText(key, text, position))
              setPosition(position + key.length)
            }
          }} style={{opacity: 0, height: 0, position: 'absolute'}}
          onBlur={() => {setIsFocused(false)}}
          onFocus={() => {setIsFocused(true)}}/>
        </ScrollView>
      </Pressable>
    </View>
  )
}
