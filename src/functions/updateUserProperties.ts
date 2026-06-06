import { arrayUnion, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../app/_layout";
import registerForPushNotificationsAsync from "@functions/registerForNotifications";
import { loadingStateEnum } from "@types";

export default async function updateUserProperties() {
  if (auth.currentUser !== undefined) {
    const token = await registerForPushNotificationsAsync()
    if (token.result !== loadingStateEnum.success) {
      return
    }
    
    const uid = auth.currentUser.uid
    const docRef = doc(db, "Users", uid)
    const original = await getDoc(docRef)
    if (original.exists()) {
      await setDoc(docRef, {
        tokens: arrayUnion(token.token)
      }, {
        merge: true
      })
    } else {
      await setDoc(docRef, {
        tokens: [token.token],
        lastRead: Timestamp.fromMillis(0)
      }, {
        merge: true
      })
    }
  }
}
