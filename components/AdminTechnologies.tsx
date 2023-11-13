import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-paper'
import SVGXml from './SVGXml/SVGXml.native';
import { useNavigate } from 'react-router-native';
import Header from './Header';

function EditTechnology({item, onChange, onBack}:{item: technology, onChange: (item: technology) => void, onBack: () => void}) {
  return (
    <View>
      <SVGXml xml={item.content} width={100} height={100} />
      <Text>Content</Text>
      <TextInput value={item.content} onChangeText={(e) => {onChange({...item, content: e})}}/>
      <Text>Name</Text>
      <TextInput value={item.name} onChangeText={(e) => {onChange({...item, name: e})}}/>
      <Pressable>
        <Text>Create</Text>
      </Pressable>
    </View>
  )
}

export default function AdminTechnologies() {
  const [selectedTechnology, setSelectedTechnology] = useState<technology | undefined>(undefined);
  const navigate = useNavigate();
  return (
    <View>
      <Header/>
      <Text>AdminTechnologies</Text>
      <Pressable onPress={() => {navigate('/admin')}}>
        <Text>Back</Text>
      </Pressable>
      <EditTechnology item={selectedTechnology} onChange={setSelectedTechnology} onBack={() => setSelectedTechnology(undefined)}/>
    </View>
  )
}