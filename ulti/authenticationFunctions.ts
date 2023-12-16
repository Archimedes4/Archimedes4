import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../app/_layout";

export function signIn(email: string, password: string) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      router.replace('/admin')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

export function isUserAdmin(): boolean {
  if (auth.currentUser !== null) {
    //TODO check admin
    return true
  } else {
    return false
  }
}