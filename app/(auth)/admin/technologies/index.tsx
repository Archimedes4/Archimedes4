import { View, Text, Pressable, FlatList, ListRenderItemInfo, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import SVGXml from '../../../../components/SVGXml/SVGXml';
import Header from '../../../../components/Header';
import { loadingStateEnum } from '../../../../Types';
import { addTechnology, listTechnologies, updateTechnology } from '../../../../ulti/technologyFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { router } from 'expo-router';

function TechnologyBlock({item}:{item: ListRenderItemInfo<technology>}) {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <Pressable onPress={() => {router.push(`/admin/technologies/${item.item.id}`)}} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} style={{backgroundColor: isHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}}>
      { item.item.content !== '' ?
        <View style={{margin: 'auto', marginRight: 0, marginLeft: 10}}>
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

  async function loadTechnologies() {
    setTechnologyState(loadingStateEnum.loading);
    const result = await listTechnologies();
    if (result.result === loadingStateEnum.success) {
      setTechnologies([...result.data, {
        name: 'Create',
        id: 'Create',
        content: '',
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
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Header/>
      <Text>Admin Technologies</Text>
      <Pressable onPress={() => {router.push('/admin')}}>
        <Text>Back</Text>
      </Pressable>
      <FlatList 
        data={technologies}
        renderItem={(item) => (
          <TechnologyBlock item={item}/>
        )}
      />
    </View>
  )
}