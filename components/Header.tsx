import { View, Text, Pressable } from 'react-native'
import React, { ReactNode } from 'react'
import { ActivityIcon, CodingIcon, ContactIcon, HomeIcon, SettingIcon } from './Icons'
import { useNavigate } from 'react-router-native'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useRouter } from 'expo-router'

function getWidth(width: number) {
  if (width/5 <= 100) {
    return width/5
  } else {
    return 100
  }
}

function HeaderBlock({text, onPress, children, last}:{text: string, onPress: () => void, children: ReactNode, last?: boolean | undefined}) {
  const { width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View style={{width: getWidth((width - 15))}}>
      <Pressable onPress={() => onPress()} style={{marginLeft: getWidth((width - 15))/20, marginRight: (last === true) ? getWidth((width - 15))/20:undefined, flexDirection: 'row', width: getWidth((width - 5)) - getWidth((width - 5))/20, padding: 10, backgroundColor: '#d1d1d1', borderRadius: 15}}>
        {children}
        <Text style={{marginRight: 'auto'}}>{text}</Text>
      </Pressable>
    </View>
  )
}

export default function Header() {
  const router = useRouter();
  const { width } = useSelector((state: RootState) => state.dimentions);
  return (
    <View style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: 10, paddingBottom: 10}}>
      <View style={{flexDirection: "row", backgroundColor: "#93acb5", width: getWidth((width - 15))*5+getWidth((width - 15))/20 , borderRadius: 15, paddingTop: 5, paddingBottom: 5}}>
        <HeaderBlock text='Home' onPress={() => router.replace('/')}>
          <HomeIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Coding' onPress={() => router.replace('/coding')}>
          <CodingIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Activities' onPress={() => router.replace('/activities')}>
          <ActivityIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Admin' onPress={() => router.replace('/admin')}>
          <SettingIcon width={14} height={ 14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Contact' onPress={() => router.replace('/contact')} last={true}>
          <ContactIcon width={14} height={14} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
      </View>
    </View>
  )
}