import { useEffect, useState } from "react";
import { auth } from "../app/_layout";

export default function useIsUserAuth() {
  const [isUserAuth, setIsUserAuth] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((e) => {
      console.log("Auth Change", e)
      if (e !== null) {
        setIsUserAuth(true)
        setIsLoading(false)
      } else {
        setIsUserAuth(false)
        setIsLoading(false)
      }
    })
    return () => {
      unsub()
    }
  }, [])
  return  {
    isUserAuth,
    isLoading
  }
}