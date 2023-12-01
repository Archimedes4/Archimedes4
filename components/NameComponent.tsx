//Smoke out
//Name in
//scroll rest of distance.

import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useSelector } from "react-redux";
import store, { RootState } from "../redux/store";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

function getNameProgress(progress: number) {
  const width = store.getState().dimentions.width
  if (progress < width/2) {
    return 0;
  }
  return progress - width/2
}

function getRightValue(progress: number, nameWidth: number): number {
  const width = store.getState().dimentions.width
  const progressValue = getNameProgress(progress)
  if (progressValue === 0) {
    return width
  }
  if (width - progressValue > (width - nameWidth)/2) {
    return width - progressValue - 5
  }
  return (width - nameWidth)/2
}

function getLeftValue(progress: number, nameWidth: number): number {
  const width = store.getState().dimentions.width
  const progressValue = getNameProgress(progress)
  if (progressValue === 0) {
    return -nameWidth
  }
  if (progressValue - nameWidth < ((width - nameWidth)/2 - 5)) {
    return -nameWidth - 5 +  progressValue 
  }
  return (width - nameWidth)/2
}

function getFontSize(width: number, height: number): number {
  if (width > height) {
    return height * 0.2
  } else {
    return width * 0.2
  }
}

SplashScreen.preventAutoHideAsync();

export default function NameComponent({progress}:{progress: SharedValue<number>}) {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [firstNameWidth, setFirstNameWidth] = useState<number>(0);
  const [lastNameWidth, setLastNameWidth] = useState<number>(0);
  const leftStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: getLeftValue(progress.value, firstNameWidth)
        },
      ],
    };
  });

  const rightStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: getRightValue(progress.value, lastNameWidth)
        },
      ],
    };
  });

  const smokeStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value/(width/2)
    }
  })

  const [fontsLoaded] = useFonts({
    'Bungee-Regular': require('../assets/Bungee-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{height: height}} onLayout={onLayoutRootView}>
      <Text onLayout={(e) => {setFirstNameWidth(e.nativeEvent.layout.width)}} style={{opacity: 0, position: 'absolute', fontSize: getFontSize(width, height), fontFamily: 'Bungee-Regular'}}>Andrew</Text>
      <Text onLayout={(e) => {setLastNameWidth(e.nativeEvent.layout.width)}} style={{opacity: 0, position: 'absolute', fontSize: getFontSize(width, height), fontFamily: 'Bungee-Regular'}}>Mainella</Text>
      <Animated.Image source={require('../assets/Smoke.png')} style={[{position: 'absolute', width: width * 2, marginLeft: -width/2, height: height, zIndex: 10}, smokeStyle]} height={100}/>
      <Animated.View style={[{top: height/2 - getFontSize(width, height)}, leftStyle]}>
        <Text style={{fontSize: getFontSize(width, height), position: 'absolute', color: 'white', fontFamily: 'Bungee-Regular'}}>Andrew </Text>
      </Animated.View>
      <Animated.View style={[{top: height/2}, rightStyle]}>
        <Text style={{fontSize: getFontSize(width, height), position: 'absolute', color: 'white', fontFamily: 'Bungee-Regular'}}>Mainella</Text>
      </Animated.View>
    </View>
  )
}