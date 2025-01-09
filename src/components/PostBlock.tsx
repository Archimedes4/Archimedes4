import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { ListRenderItemInfo, View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import SVGXml from "@components/SVGXml";
import { getAssest } from "@functions/storageFunctions";
import store from "@redux/store";
import { postsSlice } from "@redux/reducers/postsReducer";
import { loadingStateEnum } from "@types";

function PostCover({item, width, height}:{item: post, width: number, height: number}) {
  if (item.cover.loadingState === loadingStateEnum.loading) {
    <View style={{width: width, height: height, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" />
      <Text>Loading</Text>
    </View>
  }
  if (item.cover.loadingState === loadingStateEnum.success) {
    <Image source={{uri: item.cover.url}} style={{width: width, height: height}}/>
  }
  return (
    <Text>Failed</Text>
  )
}

export default function PostBlock({item, onSelect, width}:{item: ListRenderItemInfo<post>, onSelect: () => void, width: number}) {
  const [height, setHeight] = useState<number>(100)
  
  async function loadCover() {
    // If the cover is already loaded, get the aspect ratio and set the height
    if (item.item.cover.loadingState === loadingStateEnum.success) {
      Image.getSize(item.item.cover.url, (srcWidth, srcHeight) => {
        const aspectRatio = srcWidth / srcHeight;
        setHeight(width / aspectRatio)
      })
      return
    }
    // If the cover is not loaded, load the cover
    store.dispatch(postsSlice.actions.setCoverState({loadingState: loadingStateEnum.loading, id: item.item.id}))
    const result = await getAssest(item.item.cover.name);
    // If the cover is loaded, get the aspect ratio and set the height
    if (result.result === loadingStateEnum.success) {
      Image.getSize(result.data, (srcWidth, srcHeight) => {
        const aspectRatio = srcWidth / srcHeight;
        setHeight(width / aspectRatio)
      })
      store.dispatch(postsSlice.actions.setCoverState({loadingState: loadingStateEnum.success, id: item.item.id, url: result.data}))
    } else {
      // If the cover is not loaded, set the loading state to failed
      store.dispatch(postsSlice.actions.setCoverState({loadingState: loadingStateEnum.failed, id: item.item.id}))
    }
  }

  useEffect(() => {
    loadCover();
  }, [])
  
  return (
    <Pressable onPress={() => onSelect()} style={{width: width, height: height, borderRadius: 15, backgroundColor: '#FFFFFF', marginLeft: 'auto', marginRight: 'auto', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto'}}>
      <PostCover item={item.item} width={width} height={height}/>
      {(item.item.hiddenTitle === false) ?
        <BlurView style={{flexDirection: 'row', position: 'absolute', bottom: 0, width: width, padding: 10}}>
          <Text style={{marginLeft: 5, fontSize: 20}}>{item.item.title}</Text>
          <View style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 5}}>
            {item.item.technologies.map((svg) => (
              <SVGXml key={svg.id} xml={svg.content} width={25} height={25} />
            ))}
          </View>
        </BlurView>:null
      }
    </Pressable>
  )
}