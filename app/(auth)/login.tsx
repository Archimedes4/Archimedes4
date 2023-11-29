import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { getAuth } from "firebase/auth";
import { signIn } from '../../ulti/authenticationFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function AdminLogin() {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginHover, setIsLoginHover] = useState<boolean>(false);
  return (
    <View style={{width: width, height: height, backgroundColor: "#1c93ba"}}>
      <Text>Login</Text>
      <TextInput value={email} onChangeText={setEmail} style={{width: ((width - 20) >= 400) ? width - 20:(400 + width * 0.1), marginLeft: 'auto', marginRight: 'auto', backgroundColor: isLoginHover ? "#d3d3d3":"white", shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 20, paddingLeft: width * 0.15, paddingRight: width * 0.15}}/>
      <TextInput value={password} onChangeText={setPassword} style={{width: ((width - 20) >= 400) ? width - 20:(400 + width * 0.1), marginLeft: 'auto', marginRight: 'auto', backgroundColor: isLoginHover ? "#d3d3d3":"white", shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 20, paddingLeft: width * 0.15, paddingRight: width * 0.15}}/>
      <Pressable onPress={() => {signIn(email, password)}} onHoverIn={() => setIsLoginHover(true)} onHoverOut={() => setIsLoginHover(false)} style={{backgroundColor: isLoginHover ? "#d3d3d3":"white", shadowColor: 'black', shadowOffset: {width: 4, height: 3}, borderWidth: 3, borderColor: 'black', borderRadius: 30, padding: 20, paddingLeft: width * 0.15, paddingRight: width * 0.15, marginLeft: 'auto', marginRight: "auto"}}>
        <Text style={{margin: 10}}>Login</Text>
      </Pressable>
    </View>
  )
}