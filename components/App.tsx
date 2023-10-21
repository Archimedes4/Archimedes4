import { StatusBar } from 'expo-status-bar';
import { Dimensions, Pressable, Text, View } from 'react-native';
import React, { useEffect, useState } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

export default function App() {
  const [dimensions, setDimensions] = useState({window: windowDimensions, screen: screenDimensions});
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  });
  return (
    <View style={{width: dimensions.window.width, height: dimensions.window.height, backgroundColor: "#1c93ba"}}>
      <StatusBar style="auto" />
      
      <Text>Andrew Mainella</Text>
      <View style={{height: 40}}>
        <HelloComponet />
      </View>
      <Text style={{color: "white"}}>My Name is Andrew Mainella, I am a student, curler, coder and most important faithful.</Text>
      <View style={{flexDirection: "row"}}>
        <Pressable>
          <Text>Home</Text>
        </Pressable>
        <Pressable>
          <Text>Coding</Text>
        </Pressable>
        <Pressable>
          <Text>Activities</Text>
        </Pressable>
      </View>
      <Pressable>
        <Text>Contact Me!</Text>
      </Pressable>
    </View>
  );
}

function HelloComponet() {
  const helloOpacity = useSharedValue(2);
  const bonjourOpacity = useSharedValue(0);

  useEffect(() => {
    helloOpacity.value =  withRepeat(withTiming(0, {duration: 2000, easing: Easing.bezier(0.46, 0.8, 0.47, 1.03)}), 0, true)
    bonjourOpacity.value = withRepeat(withTiming(2, {duration: 2000, easing: Easing.bezier(0.46, 0.8, 0.47, 1.03)}), 0, true)
  }, [])

  const helloStyle = useAnimatedStyle(() => ({
    opacity: (helloOpacity.value >= 1) ? helloOpacity.value - 1:0
  }))

  const bonjourStyle = useAnimatedStyle(() => ({
    opacity: (bonjourOpacity.value >= 1) ? bonjourOpacity.value - 1:0
  }))

  return (
    <View>
      <Animated.Text style={[{position: "absolute", left: 0, top: 0, fontSize: 30, opacity: helloOpacity.value, color: "white"}, helloStyle]}>Hello,</Animated.Text>
      <Animated.Text style={[{position: "absolute", left: 0, top: 0, fontSize: 30,  opacity: bonjourOpacity.value, color: "white"}, bonjourStyle]}>Bonjour,</Animated.Text>
    </View>
  )
}