import { ListRenderItemInfo, View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { getAssest } from "../ulti/storageFunctions";
import { useEffect, useState } from "react";
import { loadingStateEnum } from "../Types";
import SVGXml from "./SVGXml";
import store from "../redux/store";
import { postsSlice } from "../redux/reducers/postsReducer";

export default function PostBlock({item, onSelect, width}:{item: ListRenderItemInfo<post>, onSelect: () => void, width: number}) {
  const [height, setHeight] = useState<number>(100)
  
  async function loadCover() {
    console.log(item)
    if (item.item.cover.loadingState === loadingStateEnum.success) {
      Image.getSize(item.item.cover.url, (srcWidth, srcHeight) => {
        const aspectRatio = srcWidth / srcHeight;
        setHeight(width / aspectRatio)
      })
      return
    }
    store.dispatch(postsSlice.actions.setCoverState({loadingState: loadingStateEnum.loading, id: item.item.id}))
    const result = await getAssest(item.item.cover.name);
    if (result.result === loadingStateEnum.success) {
      Image.getSize(result.data, (srcWidth, srcHeight) => {
        const aspectRatio = srcWidth / srcHeight;
        setHeight(width / aspectRatio)
      })
      store.dispatch(postsSlice.actions.setCoverState({loadingState: loadingStateEnum.success, id: item.item.id, url: result.data}))
    } else {
      store.dispatch(postsSlice.actions.setCoverState({loadingState: loadingStateEnum.failed, id: item.item.id}))
    }
  }

  useEffect(() => {
    loadCover();
  }, [])
  
  return (
    <Pressable onPress={() => onSelect()} style={{width: width, height: height + ((item.item.hiddenTitle === false) ? 25:0), borderRadius: 15, backgroundColor: '#FFFFFF', marginLeft: 'auto', marginRight: 'auto', overflow: 'hidden', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', padding: 'auto'}}>
      { (item.item.cover.loadingState === loadingStateEnum.loading) ?
        <View style={{width: width, height: height, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
          <Text>Loading</Text>
        </View>:
        <>
          { (item.item.cover.loadingState === loadingStateEnum.success) ?
            <Image source={{uri: item.item.cover.url}} style={{width: width, height: height}}/>:
            <Text>Failed</Text>
          }
        </>
      }
      {(item.item.hiddenTitle === false) ?
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginLeft: 5}}>{item.item.title}</Text>
          <View style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 5}}>
            {item.item.technologies.map((svg) => (
              <SVGXml key={svg.id} xml={svg.content} width={16} height={16} />
            ))}
          </View>
        </View>:null
      }
    </Pressable>
  )
}