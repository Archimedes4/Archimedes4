import { ViewProps, ViewStyle } from "react-native";
import Svg, { G, Path } from "react-native-svg";

type iconProps = {
  width: number,
  height: number,
  style?: ViewStyle | undefined
}

//https://www.svgrepo.com/svg/506663/home
export function HomeIcon({ width, height, style }: iconProps) {
  return (
    <Svg fill="#000000" viewBox="0 0 32 32" width={width} height={height} style={style}>
      <G id="SVGRepo_iconCarrier">
        <Path d="M27 18.039L16 9.501 5 18.039V14.56l11-8.54 11 8.538v3.481zm-2.75-.31v8.251h-5.5v-5.5h-5.5v5.5h-5.5v-8.25L16 11.543l8.25 6.186z"/>
      </G>
    </Svg>
  )
}

export function CodingIcon({ width, height, style }: iconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" width={width} height={height} style={style}>
      <G id="SVGRepo_iconCarrier">
        <Path d="M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  )
}

export function ActivityIcon({ width, height, style }: iconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" width={width} height={height} style={style}>
      <G id="SVGRepo_iconCarrier">
        <Path d="M3 12H6L9 21L16 3L18 12H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  )
}

export function CloseIcon({ width, height, style }: iconProps) {
  return (
    <Svg
      width={width}
      height={height}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
          fill="#0F1729"
        />
      </G>
    </Svg>
  );
}

export function ContactIcon({ width, height, style }: iconProps) {
  return (
    <Svg width={width} height={height} style={style} fill="#000000" viewBox="0 0 24 24">
      <G id="SVGRepo_iconCarrier">
        <Path d="M4,21a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H5A1,1,0,0,0,4,3ZM12,7.5a2,2,0,1,1-2,2A2,2,0,0,1,12,7.5ZM8.211,16.215a4,4,0,0,1,7.578,0A.993.993,0,0,1,14.83,17.5H9.18A1,1,0,0,1,8.211,16.215Z"/>
      </G>
    </Svg>
  )
}

export function SettingIcon({ width, height, style }: iconProps) {
  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_iconCarrier">
        <Path d="M20.1 9.2214C18.29 9.2214 17.55 7.9414 18.45 6.3714C18.97 5.4614 18.66 4.3014 17.75 3.7814L16.02 2.7914C15.23 2.3214 14.21 2.6014 13.74 3.3914L13.63 3.5814C12.73 5.1514 11.25 5.1514 10.34 3.5814L10.23 3.3914C9.78 2.6014 8.76 2.3214 7.97 2.7914L6.24 3.7814C5.33 4.3014 5.02 5.4714 5.54 6.3814C6.45 7.9414 5.71 9.2214 3.9 9.2214C2.86 9.2214 2 10.0714 2 11.1214V12.8814C2 13.9214 2.85 14.7814 3.9 14.7814C5.71 14.7814 6.45 16.0614 5.54 17.6314C5.02 18.5414 5.33 19.7014 6.24 20.2214L7.97 21.2114C8.76 21.6814 9.78 21.4014 10.25 20.6114L10.36 20.4214C11.26 18.8514 12.74 18.8514 13.65 20.4214L13.76 20.6114C14.23 21.4014 15.25 21.6814 16.04 21.2114L17.77 20.2214C18.68 19.7014 18.99 18.5314 18.47 17.6314C17.56 16.0614 18.3 14.7814 20.11 14.7814C21.15 14.7814 22.01 13.9314 22.01 12.8814V11.1214C22 10.0814 21.15 9.2214 20.1 9.2214ZM12 15.2514C10.21 15.2514 8.75 13.7914 8.75 12.0014C8.75 10.2114 10.21 8.7514 12 8.7514C13.79 8.7514 15.25 10.2114 15.25 12.0014C15.25 13.7914 13.79 15.2514 12 15.2514Z" fill="#292D32"/>
      </G>
    </Svg>
  )
}