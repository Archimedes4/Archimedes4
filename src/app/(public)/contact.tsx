import { View, Text, Pressable, Linking, TextInput, ScrollView, Platform } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { sendMessage } from '../../ulti/messageFunctions';
import { loadingStateEnum } from '../../Types';
import { GithubIcon, MailIcon } from '../../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Contact() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [sendState, setSendState] = useState<loadingStateEnum>(loadingStateEnum.notStarted)
  const [isSendHover, setIsSendHover] = useState<boolean>(false);
  const [isEmailHover, setIsEmailHover] = useState<boolean>(false);
  const [isGithubHover, setIsGithubHover] = useState<boolean>(false);
  const insets = useSafeAreaInsets()

  async function loadSendMessage() {
    setSendState(loadingStateEnum.loading)
    const result = await sendMessage(email, message)
    if (result === loadingStateEnum.success) {
      setSendState(loadingStateEnum.success);
    } else {
      setSendState(loadingStateEnum.failed);
    }
  }
  return (
    <View style={{height, backgroundColor: "#1c93ba"}}>
      <ScrollView
        style={{width: width, height: height}}
        contentContainerStyle={{paddingTop: insets.top}}
      >
        <Header />
        <View style={{shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, marginLeft: 10, marginRight: 10, marginBottom: 10, backgroundColor: "white"}}>
          <Text style={{fontSize: 20, marginLeft: 10, marginTop: 10}}>Write a message</Text>
          <TextInput multiline value={message} onChangeText={setMessage} style={{marginLeft: 10, marginRight: 10, marginTop: 3, height: height - 300, minHeight: 110, borderRadius: 5, borderWidth: 1, padding: 5}}/>
          <Text style={{marginLeft: 10, marginVertical: 5}}>Your Contact</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[{
              marginLeft: 10,
              marginRight: 10,
              shadowColor: 'black',
              shadowOffset: {width: 2, height: 1},
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 30,
              padding: 5,
            },
            // @ts-expect-error
            Platform.select({
              web: {
                outlineStyle: "none"
              }
            })]}/>
          <Pressable
            onHoverIn={() => setIsSendHover(true)}
            onHoverOut={() => {setIsSendHover(false)}}
            onPressIn={() => setIsSendHover(true)}
            onPressOut={() => {setIsSendHover(false)}}
            onPress={() => {loadSendMessage()}}
            style={{backgroundColor: isSendHover ? "#d3d3d3":"white", shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 10, marginHorizontal: 5, marginBottom: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'center'}}
          >
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>SEND</Text>
          </Pressable>
        </View>
        <View style={{flexDirection: (width < 450) ? undefined:'row', marginBottom: 10}}>
          <Pressable
            onHoverIn={() => setIsEmailHover(true)}
            onHoverOut={() => {setIsEmailHover(false)}}
            onPress={() => {Linking.openURL('mailto:andrewmainellacontact@gmail.com')}}
            style={{backgroundColor: isEmailHover ? "#d3d3d3":"white", shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 20, marginLeft: (width < 450) ? 15:10, marginRight: (width < 450) ? 15:'auto', marginBottom: 10, width: (width < 450) ? undefined:(width-30)/2}}>
            <View style={{marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row'}}>
              <MailIcon width={18} height={18}/>
              <Text style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: 10}}>Write an email</Text>
            </View>
          </Pressable>
          <Pressable
            onHoverIn={() => setIsGithubHover(true)}
            onHoverOut={() => {setIsGithubHover(false)}}
            onPress={() => {Linking.openURL('https://github.com/Archimedes4')}}
            style={{backgroundColor: isGithubHover ? "#d3d3d3":"white", shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 20, marginLeft: (width < 450) ? 15:'auto', marginRight: (width < 450) ? 15:10, marginBottom: 10, width: (width < 450) ? undefined:(width-30)/2}}>
            <View style={{marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', height: 18, marginBottom: 0}}>
              <GithubIcon width={18} height={18}/>
              <Text style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: 10}}>View on github</Text>
            </View>
          </Pressable>
        </View>
        <Text style={{ marginTop: 'auto', marginLeft: 15, marginRight: 15, marginBottom: 10, color: "white", }}>If you are looking for my insta, X, etc... You won't find it, I don't use social media</Text>
      </ScrollView>
    </View>
  )
}