import { View, Text, Pressable, ScaledSize } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigate } from 'react-router-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ActivityIcon, CodingIcon, ContactIcon, HomeIcon, SettingIcon } from './Icons';
import Header from './Header';
import MarkdownCross from './MarkdownCross';

export default function Home() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const navigate = useNavigate()
  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <StatusBar style="auto" />
      <Header />
      <View style={{height: 40}}>
        <HelloComponet />
      </View>
      <Text style={{color: "white"}}>My Name is Andrew Mainella, I am a student, curler, coder and most important faithful.</Text>
      <Text style={{color: "white"}}>Copyright &#169; 2023 Andrew Mainella</Text>
    </View>
  )
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