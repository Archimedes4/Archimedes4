import { router } from "expo-router";
import { confirmPasswordReset, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { loadingStateEnum } from "../Types";
import { auth } from "../app/_layout";

export async function signIn(email: string, password: string): Promise<loadingStateEnum> {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    router.replace('/admin')
    return loadingStateEnum.success
  } catch {
    return loadingStateEnum.failed
  }
}

export async function resetPassword(oobCode: string, newPassword: string) {
  await confirmPasswordReset(auth, oobCode, newPassword)
}