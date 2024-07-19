import { useEffect, useState } from "react";
import { Platform, Settings } from "react-native";

/*
  Pulled from https://www.npmjs.com/package/@config-plugins/apple-settings
  June 30 2024
*/
export default function useSetting<Type>(key: string): [Type | undefined, ((value: Type) => void) | undefined]{
  const [value, setValue] = useState(() => Settings.get(key));
  useEffect(() => {
    let isMounted = true;
    const callback = Settings.watchKeys(key, () => {
      if (isMounted) {
        setValue(Settings.get(key));
      }
    });
    return () => {
      Settings.clearWatch(callback);
      isMounted = false;
    };
  }, [key]);

  return [
    value,
    (value) => {
      Settings.set({ [key]: value });
      setValue(value);
    },
  ];
}