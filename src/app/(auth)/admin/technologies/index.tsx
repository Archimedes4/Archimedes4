import { View, Text, Pressable, FlatList, ListRenderItemInfo, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import SVGXml from '../../../../components/SVGXml';
import Header from '../../../../components/Header';
import { loadingStateEnum } from '../../../../Types';
import { addTechnology, listTechnologies, updateTechnology } from '../../../../ulti/technologyFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderText from '../../../../components/HeaderText';

function TechnologyBlock({item}:{item: ListRenderItemInfo<technology>}) {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <Pressable onPress={() => {router.push(`/admin/technologies/${item.item.id}`)}} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} style={{backgroundColor: isHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}}>
      { item.item.content !== '' ?
        <View style={{marginTop: 'auto', marginBottom: 'auto', marginRight: 0, marginLeft: 10}}>
          <SVGXml xml={item.item.content} width={20} height={20} />
        </View>:null
      }
      <Text style={{margin: 10, marginLeft: (item.item.content !== '' ) ? 5:10}}>{item.item.name}</Text>
    </Pressable>
  )
}

export default function AdminTechnologies() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [technologyState, setTechnologyState] = useState<loadingStateEnum>(loadingStateEnum.notStarted);
  const [technologies, setTechnologies] = useState<technology[]>([]);
  const insets = useSafeAreaInsets()

  async function loadTechnologies() {
    setTechnologyState(loadingStateEnum.loading);
    const result = await listTechnologies();
    if (result.result === loadingStateEnum.success) {
      setTechnologies([...result.data, {
        name: 'Create',
        id: 'Create',
        content: '<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45.402 45.402" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path> </g> </g></svg>',
        firstUsed: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        displayTechnology: '',
      }])
      setTechnologyState(loadingStateEnum.success)
    } else {
      setTechnologyState(loadingStateEnum.failed)
    }
  }

  useEffect(() => {
    loadTechnologies();
  }, [])

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba", paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <Header/>
      <Pressable onPress={() => {router.push('/admin')}}>
        <Text>Back</Text>
      </Pressable>
      <HeaderText text='Admin Technologies'/>
      <FlatList 
        data={technologies}
        renderItem={(item) => (
          <TechnologyBlock item={item}/>
        )}
      />
    </View>
  )
}