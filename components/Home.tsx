import { View, Text, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { Easing, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigate } from 'react-router-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { AzureIcon, FirebaseIcon, GitIcon, JavaIcon, ProcessingIcon, PythonIcon, ReactIcon, SwiftIcon } from './Icons';
import Header from './Header';
//import MarkdownCross from './MarkdownCross';

export default function Home() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [nameWidth, setNameWidth] = useState<number>(0);
  const progress = useSharedValue(0);

  const leftStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: (progress.value - nameWidth < width/2) ? (progress.value - nameWidth):width/2,
        },
      ],
    };
  });

  const rightStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: ((width - nameWidth/2)-progress.value > width/2) ? (width - nameWidth/2)-progress.value:(width - nameWidth/2)/2,
        },
      ],
    };
  });

  const smokeStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value/(width)
    }
  })

  const innerStyle = useAnimatedStyle(() => {
    return {
      top: ((width - nameWidth/2) > progress.value) ? 0:-(progress.value - (width - nameWidth/2))
    }
  })

  const scrollHandler = useAnimatedScrollHandler((event) => {
    progress.value = event.contentOffset.y * 0.1;
  });
  return (
    <>
      <Animated.ScrollView scrollEventThrottle={16} style={{width: width, height: height, zIndex: 10}} onScroll={scrollHandler}
        stickyHeaderIndices={[0]}
      >
        <Animated.View style={[{width: width, height: height, position: 'absolute', backgroundColor: "#1c93ba"}, innerStyle]}>
          <Text onLayout={(e) => {setNameWidth(e.nativeEvent.layout.width)}} style={{opacity: 0, position: 'absolute', fontSize: 30}}>Andrew</Text>
          <StatusBar style="auto" />
          <View style={{zIndex: 12}}>
            <Header />
          </View>
          <View style={{height: 40}}>
            <HelloComponet />
          </View>
          <View style={{height: 400}}>
            <Animated.Image source={require('../assets/Smoke.png')} style={[{position: 'absolute', width: width * 2, marginLeft: -width/2, height: 400, zIndex: 10}, smokeStyle]} height={100}/>
            <Animated.View style={leftStyle}>
              <Image source={require('../assets/F16.png')} style={{width: 200, height: 50, zIndex: 2}}/>
              <Text style={{fontSize: 30, position: 'absolute'}}>Andrew</Text>
            </Animated.View>
            <Animated.View style={rightStyle}>
              <Image source={require('../assets/CF-18_Hornet.png')} style={{width: 200, height: 50, zIndex: 2}}/>
              <Text style={{fontSize: 30, position: 'absolute'}}>Mainella</Text>
            </Animated.View>
          </View>
          <Text style={{color: "white"}}>My Name is Andrew Mainella, I am a student, curler, coder. I am a born and raised Manitoban</Text>
          <View>
            <Text>What I am using</Text>
            <View style={{flexDirection: "row", marginLeft: 'auto', marginRight: 'auto'}}>
              <ReactIcon width={100} height={100} />
              <ReactIcon width={100} height={100} />
              <AzureIcon width={100} height={100}/>
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
        </Animated.View>
        <View style={{height: width * 20, backgroundColor: "#1c93ba"}} pointerEvents='none'>

        </View>
      </Animated.ScrollView>
    </>
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