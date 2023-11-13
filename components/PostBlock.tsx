import { ListRenderItemInfo, View, Text, Image, Pressable } from "react-native";
import { getAssest } from "../ulti/storageFunctions";
import { useEffect } from "react";
import { loadingStateEnum } from "../Types";

export default function PostBlock({item, setPost, onSelect, width, height}:{item: ListRenderItemInfo<post>, setPost: (item: post) => void, onSelect: () => void, width: number, height: number}) {
  async function loadCover() {
    setPost({...item.item, cover: {...item.item.cover, loadingState: loadingStateEnum.loading}})
    const result = await getAssest(item.item.cover.name);
    console.log(result)
    //TODO error handle
    setPost({...item.item, cover: {...item.item.cover, loadingState: loadingStateEnum.success, url: result}})
  }

  useEffect(() => {
    loadCover();
  }, [])
  
  return (
    <Pressable onPress={() => onSelect()} style={{width: width, height: height, borderRadius: 15, backgroundColor: '#FFFFFF', marginLeft: 'auto', marginRight: 'auto', overflow: 'hidden'}}>
      { (item.item.cover.loadingState === loadingStateEnum.loading) ?
        <View>
          <Text>Loading</Text>
        </View>:
        <>
          { (item.item.cover.loadingState === loadingStateEnum.success) ?
            <Image source={{uri: item.item.cover.url}} style={{width: width, height: height * 0.9}}/>:
            <Text>Failed</Text>
          }
        </>
      }
      <Text>{item.item.title}</Text>
    </Pressable>
  )
}