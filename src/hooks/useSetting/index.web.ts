export default function useSetting<Type>(key: string): [Type | undefined, ((value: Type) => void) | undefined]{
  return [undefined, undefined]
}