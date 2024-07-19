import { View, Text, TextInput, Pressable, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import { signIn } from '../../ulti/authenticationFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { loadingStateEnum } from '../../Types';
import StyledButton from '../../components/StyledButton';
import AppleAuthenticationButton from '../../components/AppleAuthenticationButton';
import useIsUserAuth from '../../hooks/useIsUserAuth';
import { Redirect, router } from 'expo-router';
import { LogoIcon } from '../../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function getColor(hover: boolean, focus: boolean) {
  if (focus) {
    return "#d3d3d3";
  }
  if (hover) {
    return "#d3d3d3";
  }
  return "white";
}

export default function AdminLogin() {
  const { isUserAuth } = useIsUserAuth()
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const dimentions = useWindowDimensions()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginHover, setIsLoginHover] = useState<boolean>(false);
  const [emailHover, setEmailHover] = useState(false);
  const [passwordHover, setPasswordHover] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [signInState, setSignInState] = useState<loadingStateEnum>(loadingStateEnum.notStarted)
  const insets = useSafeAreaInsets()

  async function onSignIn() {
    setSignInState(loadingStateEnum.loading)
    const result = await signIn(email, password) 
    if (result === loadingStateEnum.success) {
    setSignInState(loadingStateEnum.success)
    } else {
    setSignInState(loadingStateEnum.failed)
    }
  }

  if (isUserAuth === true) {
    return (
      <Redirect href={'/admin'}/>
    )
  }

  if (Platform.OS === 'ios') {
    return (
      <View style={{width, height, backgroundColor: "#1c93ba", paddingBottom: insets.bottom}}>
        <View style={{marginTop: 'auto', marginBottom: 'auto', width}}>
          <LogoIcon width={width * 0.5} height={width * 0.5} style={{marginHorizontal: width * 0.25}}/>
          <Text style={{marginHorizontal: 'auto', fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center', marginVertical: 15}}>Andrew Mainella Login</Text>
          <View style={{marginHorizontal: 15, flexDirection: 'row'}}>
            <AppleAuthenticationButton />
          </View>
          { (width > 500) ?
            <StyledButton text='Back' style={{padding: 10, marginHorizontal: 15}} onPress={() => {router.push("/")}}/>:null
          }
        </View>
      </View>
    )
  }

  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <View style={{marginTop: 'auto', marginBottom: 'auto'}}>
        <Text style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 30, marginBottom: 10}}>Login</Text>
        <Pressable onHoverIn={() => setEmailHover(true)} onHoverOut={() => setEmailHover(false)} style={{marginBottom: 10}}>
          <TextInput value={email} onChangeText={setEmail} onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} style={{width: ((width - 20) >= 400) ? width - 20:(400 + width * 0.1), marginLeft: 'auto', marginRight: 'auto', backgroundColor: getColor(emailHover, emailFocus), shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 20}}/>
        </Pressable>
        <Pressable onHoverIn={() => setPasswordHover(true)} onHoverOut={() => setPasswordHover(false)} style={{marginBottom: 10}}>
          <TextInput textContentType='password' value={password} onChangeText={setPassword} onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)} style={{width: ((width - 20) >= 400) ? width - 20:(400 + width * 0.1), marginLeft: 'auto', marginRight: 'auto', backgroundColor: getColor(passwordHover, passwordFocus), shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 20}}/>
        </Pressable>
        <Pressable onPress={() => {onSignIn()}} onHoverIn={() => setIsLoginHover(true)} onHoverOut={() => setIsLoginHover(false)} style={{backgroundColor: isLoginHover ? "#d3d3d3":"white", shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 10, paddingLeft: width * 0.15, paddingRight: width * 0.15, marginLeft: 'auto', marginRight: "auto", marginBottom: 10}}>
          {signInState === loadingStateEnum.loading ?
            <ActivityIndicator />:null
          }
          {signInState !== loadingStateEnum.loading ?
            <Text style={{margin: 10, fontWeight: 'bold'}}>LOGIN</Text>:null
          }
        </Pressable>
      </View>
    </View>
  )
}