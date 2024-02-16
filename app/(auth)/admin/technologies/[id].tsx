import { useEffect, useState } from "react";
import { addTechnology, deleteTechnology, getTechnology, updateTechnology } from "../../../../ulti/technologyFunctions";
import { loadingStateEnum } from "../../../../Types";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SVGXml from "../../../../components/SVGXml";
import StyledButton from "../../../../components/StyledButton";
import { DatePickerModal } from "react-native-paper-dates";
import { router, useGlobalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Header from "../../../../components/Header";


export default function EditTechnology() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [isPickingLastDate, setIsPickingLastDate] = useState<boolean>(false);
  const [isPickingFirstDate, setIsPickingFirstDate] = useState<boolean>(false);
  const [isLastDateHover, setIsLastDateHover] = useState<boolean>(false);
  const [isFirstDateHover, setIsFirstDateHover] = useState<boolean>(false);
  const [editState, setEditState] = useState<loadingStateEnum>(loadingStateEnum.notStarted);
  const [loadTechState, setLoadTechState] = useState<loadingStateEnum>(loadingStateEnum.loading)
  const [item, setItem] = useState<technology>(undefined);
  const [deleteState, setDeleteState] = useState<loadingStateEnum>(loadingStateEnum.notStarted);

  //states
  const { id } = useGlobalSearchParams();

  async function EditTechnology() {
    if (item.id === 'Create') {
      const result = await addTechnology(item)
      if (result === loadingStateEnum.success) {
        setEditState(loadingStateEnum.success)
      } else [
        setEditState(loadingStateEnum.failed)
      ]
    } else {
      const result = await updateTechnology(item);
      if (result === loadingStateEnum.success) {
        setEditState(loadingStateEnum.success)
      } else {
        setEditState(loadingStateEnum.failed)
      }
    }
  }

  async function pressDelete() {
    if (typeof id === 'string') {
      setDeleteState(loadingStateEnum.loading)
      const result = await deleteTechnology(id)
      setDeleteState(result)
    } else {
      setDeleteState(loadingStateEnum.failed)
    }
  }

  async function loadTechnology() {
    if (typeof id === 'string' && id !== 'Create') {
      const result = await getTechnology(id);
      if (result.result === loadingStateEnum.success) {
        setItem(result.data)
      }
      setLoadTechState(result.result)
    } else if (id === 'Create') {
      setItem({
        name: 'Create',
        id: 'Create',
        content: '',
        firstUsed: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        displayTechnology: '',
      })
      setLoadTechState(loadingStateEnum.success)
    } else {
      setLoadTechState(loadingStateEnum.failed)
    }
  }

  useEffect(() => {
    loadTechnology()
  }, [])
  
  if (item !== undefined && loadTechState === loadingStateEnum.success) {
    return (
      <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
        <Header />
        <Pressable onPress={() => router.push("/admin/technologies")}>
          <Text>Back</Text>
        </Pressable>
        <SVGXml xml={item.content} width={100} height={100} />
        <Text>Content</Text>
        <TextInput style={{backgroundColor: '#d3d3d3'}} value={item.content} onChangeText={(e) => {setItem({...item, content: e})}}/>
        <Text>Name</Text>
        <TextInput style={{backgroundColor: '#d3d3d3'}} value={item.name} onChangeText={(e) => {setItem({...item, name: e})}}/>
        <Text>First Date</Text>
        <View style={{flexDirection: 'row'}}>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={isPickingFirstDate}
            onDismiss={() => {setIsPickingFirstDate(false)}}
            date={new Date(item.firstUsed)}
            onConfirm={(e) => {
              setItem({...item, firstUsed: e.date.toISOString()})
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
              setItem({...item, lastUsed: e.date.toISOString()})
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
        <StyledButton
          onPress={() => {EditTechnology()}}
          text={editState === loadingStateEnum.notStarted ? (item.id === 'Create' ? 'Create Technology':'Edit Technology'):editState === loadingStateEnum.loading ? 'Loading':editState === loadingStateEnum.success ? 'Success':'Failed'}
          style={{margin: 10}}
          textStyle={{margin: 10}}
        />
        <StyledButton
          onPress={() => pressDelete()}
          text='Delete'
          style={{margin: 10}}
          textStyle={{margin: 10}}
        />
      </View>
    )
  }

  if (loadTechState === loadingStateEnum.loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }

  if (loadTechState === loadingStateEnum.notFound) {
    return (
      <View>
        <StyledButton text="Back" onPress={() => router.push("/admin/technologies")}/>
        <Text>Technology not found!</Text>
      </View>
    )
  }

  return (
   <View>
    <Text>Failed</Text>
   </View>
  )
}