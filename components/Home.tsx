import { View, Text, Pressable, ScaledSize, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigate } from 'react-router-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ActivityIcon, AzureIcon, CodingIcon, ContactIcon, FirebaseIcon, GitIcon, HomeIcon, JavaIcon, ProcessingIcon, PythonIcon, ReactIcon, SettingIcon, SwiftIcon } from './Icons';
import Header from './Header';
import MarkdownCross from './MarkdownCross';

export default function Home() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const navigate = useNavigate()
  return (
    <ScrollView style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <StatusBar style="auto" />
      <Header />
      <View style={{height: 40}}>
        <HelloComponet />
      </View>
      <Text style={{color: "white"}}>My Name is Andrew Mainella, I am a student, curler, coder and most important faithful.</Text>
      <View>
        <Text>What I am using</Text>
        <View style={{flexDirection: "row", marginLeft: 'auto', marginRight: 'auto'}}>
          <ReactIcon width={100} height={100} />
          <ReactIcon width={100} height={100} />
          {/* <AzureIcon width={100} height={100}/> */}
        </View>
        <Text>What I am learning</Text>
        <View style={{flexDirection: "row", marginLeft: 'auto', marginRight: 'auto'}}>
          <JavaIcon width={100} height={100}/>
          <ProcessingIcon width={100} height={100}/>
          <PythonIcon width={100} height={100}/>
        </View>
        <Text>What I have used</Text>
        <View style={{flexDirection: "row", marginLeft: 'auto', marginRight: 'auto'}}>
          <FirebaseIcon width={100} height={100}/>
          <SwiftIcon width={100} height={100} />
          <GitIcon width={100} height={100} />
        </View>
      </View>
      <View>
        <Text style={{color: "white"}}>Copyright &#169; 2023 Andrew Mainella</Text>
      </View>
    </ScrollView>
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