import { ImageSourcePropType } from "react-native"

export const getIconSource = (species: string): ImageSourcePropType => {
  switch (species) {
    case 'dog':
      return require('../assets/icons/dog.png')
    case 'cat':
      return require('../assets/icons/cat.png')
    case 'bird':
      return require('../assets/icons/bird.png')
    case 'others':
      return require('../assets/icons/animal.png')
  }
}