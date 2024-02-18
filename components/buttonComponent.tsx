import { Image, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, Forms } from "../styles"

export const AddButton = ({ onPress }) => ( 
  <TouchableOpacity onPress={onPress} style={{
    ...Buttons.main,
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: Colors.pink,
    ...Spacing.centered,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 2,
  }}>
    <Text style={{
      color: Colors.white,
      fontSize: 30,
      fontWeight: 'bold'
    }}>
      +
    </Text>
  </TouchableOpacity>
)


export const SquareButton = ({title, onPress}) => (
  <TouchableOpacity onPress={onPress} style={{
    width: 40,
    height: 60,
    borderRadius: 10,
    marginHorizontal: 2,
    backgroundColor: title === 'Edit' ? Colors.yellowArray[2] : title === 'Delete' ? Colors.redArray[1] : Colors.greenArray[2],
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Image
      source={
        title === 'Edit' ? require('../assets/icons/edit.png')
        : title === 'Delete' ? require('../assets/icons/delete.png')
        : title === 'Details' ? require('../assets/icons/details.png')
        : ''
      }
      style={{...Forms.smallIcon}}
    />
  </TouchableOpacity>
)

export const CloseButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    width: 60,
    height: 60,
  }}>
    <Image source={require('../assets/icons/close.png')} style={{
      width: 40,
      height: 40,
      margin: 10
    }} />
  </TouchableOpacity>
)


