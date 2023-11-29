/*
  Andrew Mainella About
  Andrew Mainella
  28 November 2023
  Home.tsx
  The main home page
*/
import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { Easing, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import store, { RootState } from '../redux/store';
import { AzureIcon, FirebaseIcon, GitIcon, JavaIcon, ProcessingIcon, PythonIcon, ReactIcon, SwiftIcon } from '../components/Icons';
import Header from '../components/Header';
import NameComponent from '../components/NameComponent';

function BodyComponent({onLayoutHeight}:{onLayoutHeight: (item: number) => void}) {
  const { width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View onLayout={(e) => onLayoutHeight(e.nativeEvent.layout.height)}>
      <View style={{height: 40}}>
        <HelloComponet />
      </View>
      <Text style={{color: "white", fontSize: 25}}>My Name is Andrew Mainella, I am a student, curler, coder. I am a born and raised Manitoban. I am a student at Saint Paul's High School</Text>
      <View>
        <Text adjustsFontSizeToFit style={{color: 'white', fontSize: 50, marginLeft: 20}}>What I am using</Text>
        <View style={{flexDirection: "row", marginLeft: 'auto', marginRight: 'auto'}}>
          <ReactIcon width={width * 0.3} height={width * 0.3} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
          <ReactIcon width={width * 0.3} height={width * 0.3} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
          <AzureIcon width={width * 0.3} height={width * 0.3} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
        </View>
        <Text adjustsFontSizeToFit style={{color: 'white', fontSize: 50, marginLeft: 20}}>What I am learning</Text>
        <View style={{flexDirection: "row", marginLeft: 'auto', marginRight: 'auto'}}>
          <JavaIcon width={width * 0.3} height={width * 0.3}/>
          <ProcessingIcon width={width * 0.3} height={width * 0.3}/>
          <PythonIcon width={width * 0.3} height={width * 0.3}/>
        </View>
        <Text adjustsFontSizeToFit numberOfLines={1} style={{color: 'white', fontSize: 50}}>What I have used</Text>
        <View style={{flexDirection: "row", marginLeft: 'auto', marginRight: 'auto'}}>
          <FirebaseIcon width={100} height={100}/>
          <SwiftIcon width={100} height={100} />
          <GitIcon width={100} height={100} />
        </View>
      </View>
      <View>
        <Text style={{color: "white"}}>Copyright &#169; 2023 Andrew Mainella</Text>
      </View>
    </View>
  );
}

export default function Home() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const progress = useSharedValue(0);
  const [bodyHeight, setBodyHeight] = useState<number>(0);

  const innerStyle = useAnimatedStyle(() => {
    return {
      top: ((width) > progress.value) ? 0:-(progress.value - (width * 2))
    }
  })

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: ((width * 2) > progress.value) ? 0:(progress.value - (width * 2)),
      top: ((width * 2) > progress.value) ? 0:(progress.value - (width * 2))
    }
  })

  const scrollHandler = useAnimatedScrollHandler((event) => {
    progress.value = event.contentOffset.y * 0.1;
  });

  return (
    <Animated.ScrollView scrollEventThrottle={16} style={{width: width, height: height, zIndex: 10}} onScroll={scrollHandler}
      stickyHeaderIndices={[0]}
    >
      <Animated.View style={[{width: width, height: height, position: 'absolute'}, innerStyle]}>
        <StatusBar style="auto" />
        <Animated.View style={[{zIndex: 12, width: width, position: 'absolute'}, headerStyle]}>
          <Header />
        </Animated.View>
        <NameComponent progress={progress}/>
        <BodyComponent onLayoutHeight={setBodyHeight}/>
      </Animated.View>
      <View style={{height: width * 2 + bodyHeight, backgroundColor: "#1c93ba"}} pointerEvents='none'>
        
      </View>
    </Animated.ScrollView>
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
      <Animated.Text style={[{position: "absolute", left: 0, top: 0, fontSize: 30, opacity: helloOpacity.value, color: "white"}, helloStyle]}>Hello</Animated.Text>
      <Animated.Text style={[{position: "absolute", left: 0, top: 0, fontSize: 30,  opacity: bonjourOpacity.value, color: "white"}, bonjourStyle]}>Bonjour</Animated.Text>
    </View>
  )
}