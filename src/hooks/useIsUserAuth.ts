import { useEffect, useState } from "react";
import { auth } from "../app/_layout";

export default function useIsUserAuth() {
  const [isUserAuth, setIsUserAuth] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (e) => {
      if (e !== null) {
        const tokenResult = await e.getIdTokenResult()
        setIsUserAuth(true)
        setIsAdmin(tokenResult.claims.admin === true)
        setIsLoading(false)
      } else {
        setIsUserAuth(false)
        setIsAdmin(false)
        setIsLoading(false)
      }
    })
    return () => {
      unsub()
    }
  }, [])
  return  {
    isUserAuth,
    isAdmin,
    isLoading
  }
}
