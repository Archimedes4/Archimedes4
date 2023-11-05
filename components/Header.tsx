import { View, Text, Pressable } from 'react-native'
import React, { ReactNode } from 'react'
import { ActivityIcon, CodingIcon, ContactIcon, HomeIcon, SettingIcon } from './Icons'
import { useNavigate } from 'react-router-native'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

function getWidth(width: number) {
  if (width/5 <= 100) {
    return width/5
  } else {
    return 100
  }
}

function HeaderBlock({text, onPress, children}:{text: string, onPress: () => void, children: ReactNode}) {
  const { width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View style={{width: getWidth((width - 5))}}>
      <Pressable onPress={() => onPress()} style={{marginLeft: getWidth((width - 5))/20, flexDirection: 'row', width: getWidth((width - 5)) - getWidth((width - 5))/20, padding: 10, backgroundColor: '#d1d1d1', borderRadius: 15}}>
        {children}
        <Text style={{marginRight: 'auto'}}>{text}</Text>
      </Pressable>
    </View>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const { width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: 10, paddingBottom: 10}}>
      <View style={{flexDirection: "row", backgroundColor: "#93acb5", width: getWidth((width - 5))*5, borderRadius: 15, paddingTop: 5, paddingBottom: 5}}>
        <HeaderBlock text='Home' onPress={() => navigate('/')}>
          <HomeIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Coding' onPress={() => navigate('/coding')}>
          <CodingIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Activities' onPress={() => navigate('/activities')}>
          <ActivityIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Admin' onPress={() => navigate('/admin')}>
          <SettingIcon width={14} height={ 14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Contact' onPress={() => navigate('/contact')}>
          <ContactIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
      </View>
    </View>
  )
}