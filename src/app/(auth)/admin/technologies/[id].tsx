import { useEffect, useState } from "react";
import { addTechnology, deleteTechnology, getTechnology, updateTechnology } from "../../../../ulti/technologyFunctions";
import { loadingStateEnum } from "../../../../Types";
import { View, Text, TextInput, Pressable } from "react-native";
import SVGXml from "../../../../components/SVGXml";
import StyledButton from "../../../../components/StyledButton";
import { DatePickerModal } from "react-native-paper-dates";
import { router, useGlobalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Header from "../../../../components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, PencilIcon, PencilSlashIcon } from "../../../../components/Icons";
import LoadingComponent from "../../../../components/LoadingComponent";
import React from "react";

enum technologyAdminState {
  loading,
  notFound,
  noChangeEdit,
  changeEdit,
  create,
  loadingCreate,
  loadingDelete,
  loadingEdit,
  deleteSuccess,
  deleteFailed,
  failedCreate,
  failedEdit,
  failed
}

function TechnologyName({
  name,
  onNameChange
}:{
  name: string;
  onNameChange: (item: string) => void
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  return (
    <View style={{flexDirection: 'row', marginHorizontal: 15, backgroundColor: 'white', borderRadius: 15, padding: 10}}>
      {isEditing ?
        <TextInput value={name} onChangeText={(e) => {onNameChange(e)}} style={{width: "100%", fontSize: 25}}/>:
        <Text style={{fontSize: 25}}>{name}</Text>
      }
      {/* TODO change logo */}
      <Pressable onPress={() => setIsEditing(!isEditing)} style={{marginLeft: isEditing ? 0:'auto'}}>
        {isEditing ?
          <PencilSlashIcon width={25} height={25} style={{marginVertical: 'auto'}}/>:
          <PencilIcon width={25} height={25} style={{marginVertical: 'auto'}}/>
        }
      </Pressable>
    </View>
  )
}

function UpdateTechnologyButton({
  itemId,
  setTechState,
  techState,
  item
}:{
  itemId: string
  techState: technologyAdminState
  setTechState: (item: technologyAdminState) => void
  item: technology
}) {

  async function editTechnology() {
    if (itemId === 'Create') {
      setTechState(technologyAdminState.loadingCreate)
      const result = await addTechnology(item)
      if (result.result === loadingStateEnum.success) {
        router.push(`/admin/technologies/${result.id}`)
        setTechState(technologyAdminState.noChangeEdit)
      } else [
        setTechState(technologyAdminState.failedCreate)
      ]
    } else {
      const result = await updateTechnology(item);
      if (result === loadingStateEnum.success) {
        setTechState(technologyAdminState.noChangeEdit)
      } else {
        setTechState(technologyAdminState.failedEdit)
      }
    }
  }

  function getText(state: technologyAdminState) {
    if (state === technologyAdminState.create) {
      return "Create"
    } else if (state === technologyAdminState.changeEdit) {
      return  "Save"
    }
  }

  if (techState === technologyAdminState.noChangeEdit) {
    return null
  }

  return (
    <StyledButton
      onPress={() => {editTechnology()}}
      text={getText(techState)}
      style={{margin: 10}}
      textStyle={{margin: 10}}
    />
  )
}

function TechnologyTime({
  item,
  setItem
}:{
  item: technology;
  setItem: (item: technology) => void
}) {
  const [isPickingLastDate, setIsPickingLastDate] = useState<boolean>(false);
  const [isPickingFirstDate, setIsPickingFirstDate] = useState<boolean>(false);
  const [isLastDateHover, setIsLastDateHover] = useState<boolean>(false);
  const [isFirstDateHover, setIsFirstDateHover] = useState<boolean>(false);
  return (
    <>
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
    </>
  )
}

function TechnologyDelete({
  id,
  setTechState
}:{
  id: string;
  setTechState: (item: technologyAdminState) => void
}) {

  async function handleDelete() {
    setTechState(technologyAdminState.loadingDelete)
    const result = await deleteTechnology(id)
    if (result === loadingStateEnum.success) {
      setTechState(technologyAdminState.deleteSuccess)
      router.push('/admin/technologies')
    } else {
      setTechState(technologyAdminState.deleteFailed)
    }
  }

  if (id === 'Create') {
    return null
  }

  return (
    <StyledButton
      onPress={() => handleDelete()}
      text='Delete'
      style={{margin: 10}}
      textStyle={{margin: 10}}
    />
  )
}


function TechBackButton() {
  const [isHover, setIsHover] = useState<boolean>(false)
  return (
    <Pressable
      onPress={() => {
        router.push("/admin/technologies")
      }}
      onHoverIn={() => setIsHover(true)}
      onHoverOut={() => setIsHover(false)}
      onPressIn={() => setIsHover(true)}
      onPressOut={() => setIsHover(false)}
      style={{backgroundColor: isHover ? '#d3d3d3':'white', flexDirection: 'row', shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, margin: 10, padding: 10}}>
      <ChevronLeft width={25} height={25}/>
      <Text style={{fontSize: 20, marginVertical: 'auto'}}>Back</Text>
    </Pressable>
  )
}

export default function EditTechnology() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [techState, setTechState] = useState<technologyAdminState>(technologyAdminState.loading)
  const [item, setItem] = useState<technology>(undefined);
  const insets = useSafeAreaInsets()

  //states
  const { id } = useGlobalSearchParams();


  async function loadTechnology() {
    if (typeof id === 'string' && id !== 'Create') {
      const result = await getTechnology(id);
      if (result.result === loadingStateEnum.success) {
        setItem(result.data)
        setTechState(technologyAdminState.noChangeEdit)
      } else if (result.result === loadingStateEnum.notFound) {
        setTechState(technologyAdminState.notFound)
      } else {
        setTechState(technologyAdminState.failed)
      }
    } else if (id === 'Create') {
      setItem({
        name: 'Create',
        id: 'Create',
        content: '',
        firstUsed: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        displayTechnology: '',
      })
      setTechState(technologyAdminState.create)
    } else if (typeof id === 'string' && id === 'Create') {
      setTechState(technologyAdminState.create)
    } else {
      setTechState(technologyAdminState.notFound)
    }
  }

  useEffect(() => {
    loadTechnology()
  }, [])

  if (techState === technologyAdminState.loading) {
    return (
      <LoadingComponent />
    )
  }

  if (techState === technologyAdminState.notFound) {
    return (
      <View>
        <StyledButton text="Back" onPress={() => router.push("/admin/technologies")}/>
        <Text>Technology not found!</Text>
      </View>
    )
  }
  
  if (item !== undefined && [technologyAdminState.noChangeEdit, technologyAdminState.changeEdit, technologyAdminState.create].includes(techState)) {
    return (
      <View style={{width: width, height: height, backgroundColor: "#1c93ba", paddingTop: insets.top}}>
        <Header />
        <TechBackButton />
        <TechnologyName name={item.name} onNameChange={(e) => {setItem({...item, name: e})}} />
        <View style={{flexDirection: (width < 576) ? undefined:'row', marginTop: 15}}>
          <SVGXml xml={item.content} width={100} height={100} />
          <TextInput
            style={{backgroundColor: 'white', width: (width < 576) ? (width-30):width-200, height: 100}}
            value={item.content}
            onChangeText={(e) => {setItem({...item, content: e})}}
            multiline
          />
        </View>
        <TechnologyTime item={item} setItem={setItem}/>
        <TechnologyDelete id={item.id} setTechState={setTechState}/>
        <UpdateTechnologyButton
          itemId={item.id}
          techState={techState}
          setTechState={setTechState}
          item={item}
        />
      </View>
    )
  }

  return (
    <View>
      <Text>Failed</Text>
    </View>
  )
}