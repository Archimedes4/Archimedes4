//Smoke out
//Name in
//scroll rest of distance.

import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useSelector } from "react-redux";
import store, { RootState } from "../redux/store";
import { useState } from "react";
import { Text, View } from "react-native";


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

export default function NameComponent({progress}:{progress: SharedValue<number>}) {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [firstNameWidth, setFirstNameWidth] = useState<number>(0);
  const [lastNameWidth, setLastNameWidth] = useState<number>(0);
  const leftStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: getLeftValue(progress.value * 3, firstNameWidth)
        },
      ],
    };
  });

  const rightStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: getRightValue(progress.value * 3)
        },
      ],
    };
  });

  const smokeStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value/(width/2)
    }
  })

  return (
    <View style={{height: height}}>
      <Text onLayout={(e) => {setFirstNameWidth(e.nativeEvent.layout.width)}} style={{opacity: 0, position: 'absolute', fontSize: height * 0.2}}>Andrew</Text>
      <Text onLayout={(e) => {setFirstNameWidth(e.nativeEvent.layout.width)}} style={{opacity: 0, position: 'absolute', fontSize: height * 0.2}}>Mainella</Text>
      <Animated.Image source={require('../assets/Smoke.png')} style={[{position: 'absolute', width: width * 2, marginLeft: -width/2, height: height, zIndex: 10}, smokeStyle]} height={100}/>
      <Animated.View style={[{top: height/2 - height * 0.15}, leftStyle]}>
        <Text style={{fontSize: height * 0.3, position: 'absolute', color: 'white'}}>Andrew</Text>
      </Animated.View>
      <Animated.View style={[{top: height/2 - height * 0.15}, rightStyle]}>
        <Text style={{fontSize: height * 0.3, position: 'absolute', color: 'white'}}>Mainella</Text>
      </Animated.View>
    </View>
  )
}