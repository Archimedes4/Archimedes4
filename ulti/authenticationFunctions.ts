import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export function signIn(email: string, password: string) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      router.replace('/admin')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

export function isUserAdmin(): boolean {
  const auth = getAuth()
  if (auth.currentUser !== null) {
    //TODO check admin
    return true
  } else {
    return false
  }
}