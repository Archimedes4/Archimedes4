import { View, Text, Pressable, FlatList, ListRenderItemInfo, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import SVGXml from './SVGXml/SVGXml';
import { useNavigate } from 'react-router-native';
import Header from './Header';
import { loadingStateEnum } from '../Types';
import { listTechnologies } from '../ulti/technologyFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function EditTechnology({item, onChange, onBack}:{item: technology, onChange: (item: technology) => void, onBack: () => void}) {
  const [isCreateHover, setIsCreateHover] = useState<boolean>(false);
  const [isPickingLastDate, setIsPickingLastDate] = useState<boolean>(false);
  const [isPickingFirstDate, setIsPickingFirstDate] = useState<boolean>(false);
  const [isLastDateHover, setIsLastDateHover] = useState<boolean>(false);
  const [isFirstDateHover, setIsFirstDateHover] = useState<boolean>(false);

  return (
    <SafeAreaProvider>
      <View>
        <SVGXml xml={item.content} width={100} height={100} />
        <Text>Content</Text>
        <TextInput value={item.content} onChangeText={(e) => {onChange({...item, content: e})}}/>
        <Text>Name</Text>
        <TextInput value={item.name} onChangeText={(e) => {onChange({...item, name: e})}}/>
        <Text>First Date</Text>
        <View style={{flexDirection: 'row'}}>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={isPickingFirstDate}
            onDismiss={() => {setIsPickingFirstDate(false)}}
            date={new Date(item.firstUsed)}
            onConfirm={(e) => {
              onChange({...item, firstUsed: e.date.toISOString()})
              setIsPickingFirstDate(false)
            }}
          />
          <Text>{new Date(item.firstUsed).toLocaleString('en', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}</Text>
          <Pressable onHoverIn={() => setIsFirstDateHover(true)} onHoverOut={() => setIsFirstDateHover(false)} onPress={() => setIsPickingFirstDate(true)} style={{backgroundColor: isFirstDateHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}}>
            <Text style={{margin: 10}}>Pick Date</Text>
          </Pressable>
        </View>
        <Text>Last Date</Text>
        <View style={{flexDirection: 'row'}}>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={isPickingLastDate}
            onDismiss={() => {setIsPickingLastDate(false)}}
            date={new Date(item.firstUsed)}
            onConfirm={(e) => {
              onChange({...item, lastUsed: e.date.toISOString()})
              setIsPickingLastDate(false)
            }}
          />
          <Text>{new Date(item.lastUsed).toLocaleString('en', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}</Text>
          <Pressable onHoverIn={() => setIsLastDateHover(true)} onHoverOut={() => setIsLastDateHover(false)} onPress={() => setIsPickingLastDate(true)} style={{backgroundColor: isLastDateHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}}>
            <Text style={{margin: 10}}>Pick Date</Text>
          </Pressable>
        </View>
        <Text>Include On Homepage</Text>

        <Pressable onHoverIn={() => setIsCreateHover(true)} onHoverOut={() => setIsCreateHover(false)} style={{backgroundColor: isCreateHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}}>
          <Text style={{margin: 10}}>Create</Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  )
}

function TechnologyBlock({item,setSelectedTechnology}:{item: ListRenderItemInfo<technology>, setSelectedTechnology: (item: technology) => void}) {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <Pressable onPress={() => {setSelectedTechnology(item.item)}} onHoverIn={() => setIsHover(true)} onHoverOut={() => setIsHover(false)} style={{backgroundColor: isHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10}}>
      { item.item.content !== '' ?
        <SVGXml xml={item.item.content} width={20} height={20}/>:''
      }
      <Text style={{margin: 10}}>{item.item.name}</Text>
    </Pressable>
  )
}

export default function AdminTechnologies() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [selectedTechnology, setSelectedTechnology] = useState<technology | undefined>(undefined);
  const navigate = useNavigate();
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
      <Text>AdminTechnologies</Text>
      <Pressable onPress={() => {navigate('/admin')}}>
        <Text>Back</Text>
      </Pressable>
      { selectedTechnology !== undefined ?
        <EditTechnology item={selectedTechnology} onChange={setSelectedTechnology} onBack={() => setSelectedTechnology(undefined)}/>:
        <FlatList 
          data={technologies}
          renderItem={(item) => (
            <TechnologyBlock item={item} setSelectedTechnology={setSelectedTechnology}/>
          )}
        />
      }
    </View>
  )
}