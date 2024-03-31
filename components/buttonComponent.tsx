import { Image, ImageSourcePropType, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, Forms, Typography } from "@styles/index"

const whiteBtnTextStyles: TextStyle = {
  color: Colors.white,
  fontWeight: 'bold'
}

const smallIconButtonStyles: ViewStyle = {
  marginHorizontal: 5,
}

export const AddButton = ({ onPress }) => ( 
  <TouchableOpacity onPress={onPress} style={{
    ...Buttons.roundButton,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 2,
  } as ViewStyle}>
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
  } as ViewStyle}>
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
  } as ViewStyle}>
    <Text style={{
      ...whiteBtnTextStyles,
      fontSize: 15,
    }}>
      −
    </Text>
  </TouchableOpacity>
)

export const SaveButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    ...smallIconButtonStyles,
  } as ViewStyle}>
    <Image source={require('@assets/icons/save.png')} style={{...Forms.smallIcon}} />
  </TouchableOpacity>
)

export const DeleteButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    ...smallIconButtonStyles,
  } as ViewStyle}>
    <Image source={require('@assets/icons/delete.png')} style={{...Forms.smallIcon}} />
  </TouchableOpacity>
)

export const UndoButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    ...smallIconButtonStyles,
  } as ViewStyle}>
    <Image source={require('@assets/icons/undo.png')} style={{...Forms.smallIcon}} />
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

export const MediumButton = ({ title, onPress, top, bottom, color }) => (
  <TouchableOpacity onPress={onPress} style={[
    {
      ...Buttons.xSmallSquare,
      backgroundColor: color ?? Colors.pink,
    },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={{
      ...Buttons.buttonText,
      fontSize: 15,
    }}>
      {title}
    </Text>
  </TouchableOpacity>
)

type StatButtonProps = {
  item: { header: string, stat?: number, iconUri?: any, body: string }
  color?: string,
  onPress?: () => void
}

export const StatButton = ({ item, color, onPress }: StatButtonProps) => (
  <Pressable onPress={onPress} style={{
    ...Spacing.flexColumn,
    borderRadius: 15,
    backgroundColor: color ?? Colors.lightPink,
    padding: 10,
    width: 71,
    height: 83,
  }}>
    <Text style={{
      fontSize: 12,
      fontStyle: 'italic'
    }}>
      {item.header}
    </Text>
    {item.stat >=0 && 
      <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 2,
      }}>
        {item.stat === Infinity ? '?' : item.stat}
      </Text> 
    }
    {item.iconUri && 
      <Image source={item.iconUri as ImageSourcePropType} style={{
        ...Forms.smallIcon,
        margin: 0,
      }}/>
    }
    <Text style={{
      ...Typography.xSmallBody,
    }}>
      {item.body}
    </Text>
  </Pressable>
)