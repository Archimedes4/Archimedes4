import { setBadgeCountAsync } from "expo-notifications";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../app/_layout";

export default async function updateMessageLastRead() {
  try {
    const uid = auth.currentUser?.uid
    if (uid !== undefined) {
      const result = await setBadgeCountAsync(0)
      if (result) {
        await updateDoc(doc(db, "Users", uid), {
          lastRead: serverTimestamp()
        })
      }
    }
  } catch {}
}