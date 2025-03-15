import { Platform } from "react-native";
import useSetting from "@hooks/useSetting";

export function useIsShowingAdmin() {
  if (Platform.OS !== 'ios') {
    return false
  }
  const [val] = useSetting("showing_login")
  if (val === 1) {
    return true
  }
  return false
}