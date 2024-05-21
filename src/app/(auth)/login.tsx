import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { getAuth } from "firebase/auth";
import { signIn } from '../../ulti/authenticationFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { loadingStateEnum } from '../../Types';

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
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginHover, setIsLoginHover] = useState<boolean>(false);
  const [emailHover, setEmailHover] = useState(false);
  const [passwordHover, setPasswordHover] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [signInState, setSignInState] = useState<loadingStateEnum>(loadingStateEnum.notStarted)

  async function onSignIn() {
    setSignInState(loadingStateEnum.loading)
    const result = await signIn(email, password) 
    if (result === loadingStateEnum.success) {
    setSignInState(loadingStateEnum.success)
    } else {
    setSignInState(loadingStateEnum.failed)
    }
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