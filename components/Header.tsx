import { View, Text, Pressable, Linking } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
import { ActivityIcon, CodingIcon, ContactIcon, GithubIcon, HomeIcon } from './Icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useRouter } from 'expo-router'

function getWidth(width: number) {
  if (width/5 <= 20) {
    return width/10
  } else if (width/5 <= 100) {
    return width/5
  } else {
    return 100
  }
}

function HeaderBlock({text, onPress, children, last}:{text: string, onPress: () => void, children: ReactNode, last?: boolean | undefined}) {
  const { width } = useSelector((state: RootState) => state.dimentions);
  const [fontSize, setFontSize] = useState<number>(15);
  useEffect(() => {
    console.log(getWidth(width-5))
    const compWidth = getWidth((width - 5))
    if (compWidth < 100) {
      setFontSize(compWidth/15)
    } else {
      setFontSize(15)
    }
  }, [width])
  return (
    <View style={{width: getWidth((width - 15))}}>
      <Pressable onPress={() => onPress()} style={{marginLeft: getWidth((width - 15))/20, marginRight: (last === true) ? getWidth((width - 15))/20:undefined, flexDirection: 'row', width: getWidth((width - 5)) - getWidth((width - 5))/20, padding: 10, backgroundColor: '#d1d1d1', borderRadius: 15}}>
        {children}
        <Text style={{marginRight: 'auto', marginLeft: 2, fontSize}}>{text}</Text>
      </Pressable>
    </View>
  )
}

export default function Header() {
  const router = useRouter();
  const { width } = useSelector((state: RootState) => state.dimentions);
  const [compSize, setCompSize] = useState<number>(14);

  useEffect(() => {
    const compWidth = getWidth((width - 5))
    if (compWidth < 100) {
      setCompSize(compWidth/14)
    } else {
      setCompSize(14)
    }
  }, [width])

  return (
    <View style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: 10, paddingBottom: 10}}>
      <View style={{flexDirection: "row", backgroundColor: "#93acb5", width: getWidth((width - 15))*5+getWidth((width - 15))/20 , borderRadius: 15, paddingTop: 5, paddingBottom: 5}}>
        <HeaderBlock text='Home' onPress={() => router.replace('/')}>
          <HomeIcon width={compSize} height={compSize} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Coding' onPress={() => router.replace('/coding')}>
          <CodingIcon width={compSize} height={compSize} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Activities' onPress={() => router.replace('/activities')}>
          <ActivityIcon width={compSize} height={compSize} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='GitHub' onPress={() => Linking.openURL('https://github.com/Archimedes4')}>
          <GithubIcon width={compSize} height={compSize} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
        <HeaderBlock text='Contact' onPress={() => router.replace('/contact')} last={true}>
          <ContactIcon width={compSize} height={compSize} style={{margin: 'auto', marginRight: 0}}/>
        </HeaderBlock>
      </View>
    </View>
  )
}