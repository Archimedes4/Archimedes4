import { View, Text, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { Easing, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigate } from 'react-router-native';
import { useSelector } from 'react-redux';
import store, { RootState } from '../redux/store';
import { AzureIcon, FirebaseIcon, GitIcon, JavaIcon, ProcessingIcon, PythonIcon, ReactIcon, SwiftIcon } from './Icons';
import Header from './Header';
//import MarkdownCross from './MarkdownCross';

function getRightValue(progress: number): number {
  const width = store.getState().dimentions.width
  const progressValue = (progress - width > 0) ? progress - width:0;
  if (progressValue === 0) {
    return width
  }
  if (width - progressValue > width/2) {
    return width - progressValue
  }
  return width/2
}

function getLeftValue(progress: number, nameWidth: number): number {
  const width = store.getState().dimentions.width
  const progressValue = (progress - width > 0) ? progress - width:0;
  //(progress.value - nameWidth < (width/2 - nameWidth)) ? (progress.value - nameWidth):(width/2 -nameWidth)
  if (progressValue === 0) {
    return -nameWidth
  }
  if (progressValue - nameWidth < (width/2 - nameWidth)) {
    return progressValue - nameWidth
  }
  return width/2 -nameWidth
}

function NameComponent({progress}:{progress: SharedValue<number>}) {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [nameWidth, setNameWidth] = useState<number>(0);
  const leftStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: getLeftValue(progress.value, nameWidth),
        },
      ],
    };
  });

  const rightStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: getRightValue(progress.value),
        },
      ],
    };
  });

  const smokeStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value/(width)
    }
  })
  return (
    <View style={{height: 400}}>
      <Text onLayout={(e) => {setNameWidth(e.nativeEvent.layout.width)}} style={{opacity: 0, position: 'absolute', fontSize: height * 0.1}}>Andrew </Text>
      <Animated.Image source={require('../assets/Smoke.png')} style={[{position: 'absolute', width: width * 2, marginLeft: -width/2, height: 400, zIndex: 10}, smokeStyle]} height={100}/>
      <Animated.View style={leftStyle}>
        <Text style={{fontSize: height * 0.1, position: 'absolute'}}>Andrew</Text>
      </Animated.View>
      <Animated.View style={rightStyle}>
        <Text style={{fontSize: height * 0.1, position: 'absolute'}}>Mainella</Text>
      </Animated.View>
    </View>
  )
}

export default function Home() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const progress = useSharedValue(0);

  const innerStyle = useAnimatedStyle(() => {
    return {
      top: ((width * 2) > progress.value) ? 0:-(progress.value - (width * 2))
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
    <>
      <Animated.ScrollView scrollEventThrottle={16} style={{width: width, height: height, zIndex: 10}} onScroll={scrollHandler}
        stickyHeaderIndices={[0]}
      >
        <Animated.View style={[{width: width, height: height, position: 'absolute'}, innerStyle]}>
          <StatusBar style="auto" />
          <Animated.View style={[{zIndex: 12, position: 'absolute', left: 'auto', right: 'auto'}, headerStyle]}>
            <Header />
          </Animated.View>
          <View style={{height: 40}}>
            <HelloComponet />
          </View>
          <NameComponent progress={progress}/>
          <Text style={{color: "white", fontSize: 25}}>My Name is Andrew Mainella, I am a student, curler, coder. I am a born and raised Manitoban. I am a student at Saint Paul's High School</Text>
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
        <View style={{height: width * 40, backgroundColor: "#1c93ba"}} pointerEvents='none'>
          
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
      <Animated.Text style={[{position: "absolute", left: 0, top: 0, fontSize: 30, opacity: helloOpacity.value, color: "white"}, helloStyle]}>Hello</Animated.Text>
      <Animated.Text style={[{position: "absolute", left: 0, top: 0, fontSize: 30,  opacity: bonjourOpacity.value, color: "white"}, bonjourStyle]}>Bonjour</Animated.Text>
    </View>
  )
}