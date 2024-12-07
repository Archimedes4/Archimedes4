import { Platform } from "react-native";
import useSetting from "./useSetting";

export function useIsShowingAdmin() {
  if (Platform.OS !== 'ios') {
    return false
  }
  const [val, setVal] = useSetting("showing_login")
  if (val === 1) {
    return true
  }
  return false
}