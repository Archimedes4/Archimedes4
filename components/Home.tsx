import { View, Text, Pressable, ScaledSize } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigate } from 'react-router-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Home() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const navigate = useNavigate()
  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <StatusBar style="auto" />
      <Text>Andrew Mainella</Text>
      <View style={{height: 40}}>
        <HelloComponet />
      </View>
      <Text style={{color: "white"}}>My Name is Andrew Mainella, I am a student, curler, coder and most important faithful.</Text>
      <View style={{flexDirection: "row"}}>
        <Pressable onPress={() => navigate('/')}>
          <Text>Home</Text>
        </Pressable>
        <Pressable onPress={() => navigate('/coding')}>
          <Text>Coding</Text>
        </Pressable>
        <Pressable onPress={() => navigate('/activitys')}>
          <Text>Activities</Text>
        </Pressable>
        <Pressable onPress={() => navigate('/admin')}>
          <Text>Admin</Text>
        </Pressable>
      </View>
      <Pressable>
        <Text>Contact Me!</Text>
      </Pressable>
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