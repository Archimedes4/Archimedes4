import Svg, { G, Path } from "react-native-svg";

type iconProps = {
  width: number,
  height: number
}

//https://www.svgrepo.com/svg/506663/home
export function HomeIcon() {
  return (
    <Svg fill="#000000" viewBox="0 0 32 32">
      <G id="SVGRepo_iconCarrier">
        <Path d="M27 18.039L16 9.501 5 18.039V14.56l11-8.54 11 8.538v3.481zm-2.75-.31v8.251h-5.5v-5.5h-5.5v5.5h-5.5v-8.25L16 11.543l8.25 6.186z"/>
      </G>
    </Svg>
  )
}