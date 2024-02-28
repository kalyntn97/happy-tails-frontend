import { Colors } from "@styles/index"

export const getColorArray = (): string[] => {
  const colorArrays = [
    Colors.greenArray, Colors.blueArray, Colors.pinkArray, Colors.yellowArray, Colors.purpleArray
  ]
  const randomIdx = Math.floor(Math.random() * colorArrays.length)
  return colorArrays[randomIdx]
}

export const getColor = (ref: number, value: number, colorArray: string[]): string => {
  const color = ref === value 
    ? colorArray[0] 
    : value === 0 
      ? colorArray[2] 
      : colorArray[1]
  return color
}