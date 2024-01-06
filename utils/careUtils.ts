import { ImageSourcePropType } from "react-native"

export const getIconSource  = (name: string): ImageSourcePropType => {
  switch (name) {
    case 'Teeth Brushing':
      return require('../assets/icons/toothbrush.png')
    case 'Nail Clipping':
      return require('../assets/icons/clippers.png')

  }
}