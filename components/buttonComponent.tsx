import { Image, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, Forms } from "@styles/index"

const whiteBtnTextStyles: TextStyle = {
  color: Colors.white,
  fontWeight: 'bold'
}

export const AddButton = ({ onPress }) => ( 
  <TouchableOpacity onPress={onPress} style={{
    ...Buttons.roundButton,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 2,
  }}>
    <Text style={{
      ...whiteBtnTextStyles,
      fontSize: 30,
    }}>
      +
    </Text>
  </TouchableOpacity>
)

export const SmallAddButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    ...Buttons.smallRoundButton,
  }}>
    <Text style={{
      ...whiteBtnTextStyles,
      fontSize: 15,
    }}>
      +
    </Text>
  </TouchableOpacity>
)

export const SmallRemoveButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    ...Buttons.smallRoundButton,
  }}>
    <Text style={{
      ...whiteBtnTextStyles,
      fontSize: 15,
    }}>
      −
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
        title === 'Edit' ? require('@assets/icons/edit.png')
        : title === 'Delete' ? require('@assets/icons/delete.png')
        : title === 'Details' ? require('@assets/icons/details.png')
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
    <Image source={require('@assets/icons/close.png')} style={{
      width: 40,
      height: 40,
      margin: 10
    }} />
  </TouchableOpacity>
)

export const MainButton = ({ onPress, title, top, bottom }) => (
  <TouchableOpacity onPress={onPress} style={[
    {
      ...Buttons.smallRounded,
      backgroundColor: Colors.pink,
    },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={{
      ...Buttons.buttonText,
    }}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const SubButton = ({ onPress, title, top, bottom }) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Buttons.smallSub },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={{
      ...Buttons.buttonText,
      color: Colors.darkestPink
    }}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const GoBackButton = ({ onPress, top }) => (
  <TouchableOpacity onPress={onPress} style={{
    position: 'absolute',
    top: top,
    left: 15,
  }}>     
    <Image source={require('@assets/icons/undo.png')} style={{
      ...Forms.smallIcon,
    }}
    />
  </TouchableOpacity>
)