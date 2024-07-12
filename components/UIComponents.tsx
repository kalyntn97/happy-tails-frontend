import { ActivityIndicator, DimensionValue, Image, Modal, Pressable, StyleSheetProperties, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Spacing, Colors, Typography, UI } from "@styles/index"
import { ComponentProps, FC, MutableRefObject, ReactElement, ReactNode, forwardRef, useEffect, useState } from "react"
import { getActionIconSource } from "@utils/ui"
import { ImageSourcePropType } from "react-native"
import { ToastConfig, ToastConfigParams, ToastOptions, ToastProps } from "react-native-toast-message"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { GoBackButton, SubButton } from "./ButtonComponent"
import Animated, { FadeInDown, FadeOutDown, LayoutAnimationConfig, SlideInDown, SlideOutDown, ZoomInUp } from "react-native-reanimated"

type BoxHeaderProps = {
  title: string
  titleIconSource?: ImageSourcePropType
  onPress?: () => void
  titleColor?: string
  arrow?: string
  mode?: 'light' | 'dark'
  rightContent?: any
}

interface BoxProps extends BoxHeaderProps {
  content: any
}

export const BoxHeader: FC<BoxHeaderProps> = ({ title, onPress, titleColor, arrow, mode, titleIconSource, rightContent }) => (
  <Pressable style={{
    ...Spacing.flexRow,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    width: '100%',
    paddingVertical: 10,
  }}
    onPress={onPress}
  >
    { titleIconSource && <Image source={titleIconSource} style={{ ...UI.smallIcon }} /> }
    <Text style={[
      { ...Typography.xSmallHeader, margin: 0, marginLeft: titleIconSource ? 7 : 2, textAlign: 'left', textTransform: 'capitalize' }, 
    titleColor && { color: titleColor },
    mode === 'light' && { fontWeight: 'normal' },
    ]}>
      { title }
    </Text>
    <View style={{ ...Spacing.flexRow, marginLeft: 'auto' }}>
      { rightContent && rightContent }
      <Image source={arrow === 'down' ? getActionIconSource('down') : getActionIconSource('next')} style={{ ...UI.xSmallIcon, marginLeft: 10 }} />
    </View>
  </Pressable>
)

export const BoxWithHeader: FC<BoxProps> = ({ title, titleIconSource, onPress, content, titleColor, arrow }) => (
  <View style={{ ...UI.roundedCon }}>
    <BoxHeader title={title} onPress={onPress} titleColor={titleColor} arrow={arrow} titleIconSource={titleIconSource}/>
    <View style={{
      width: '100%'
    }}>
      { content }
    </View>
  </View>
)

type CircleIconProps = {
  iconSource: ImageSourcePropType
  size?: string
  bgColor?: string
}

export const CircleIcon = ({ iconSource, size, bgColor }: CircleIconProps) => (
  <View style={{ backgroundColor: bgColor ?? Colors.shadow.light, ...UI.roundedIconCon }}>
    <Image source={iconSource} style={{ ...UI.largeIcon }} />
  </View>
)
 
export const ErrorMessage = ({ error, top }: { error: string, top?: number }) => (
  <Text style={{ ...Typography.errorMsg, marginTop: top ?? 0 }}>{error}</Text>
)

export const ErrorImage = ({ top }: { top?: number }) => (
  <View style={[top && { marginTop: top }, { ...Spacing.centered }]}>
    <Image source={require('assets/images/error.png')} style={{ maxWidth: 300, resizeMode: 'contain' }} />
  </View>
)

export const CatToast = ({ text1, text2, props }: { text1: string, text2: string, props: any }) => (
  <View style={{ ...Spacing.flexRow, backgroundColor: Colors.white, borderRadius: 6, paddingHorizontal: 15, paddingVertical: 10, width: '90%', minHeight: 70, ...UI.boxShadow, shadowColor: props.style === 'success' ? Colors.green.dark : Colors.red.dark, ...UI.boxShadow }}>
    <Image source={props.style === 'success' ? require('assets/icons/ui-cat-happy.png') : require('assets/icons/ui-cat-sad.png')} style={{ ...UI.icon}} />
    <View style={{ ...Spacing.flexColumn, marginLeft: 10, alignItems: 'flex-start' }}>  
      <Text style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>{props.style}!</Text>
      <Text>{text1}</Text>
      { text2 && <Text style={{ flex: 1 }}>{text2}</Text> }
    </View>
    <Pressable style={{ marginLeft: 'auto' }} onPress={props.onClose}>
      <Image source={getActionIconSource('close')} style={{ ...UI.smallIcon}} />
    </Pressable>
  </View>
)

export const toastConfig = {
  catToast: ({ text1, text2, props }: ToastConfigParams<any>) => ( <CatToast text1={text1} text2={text2} props={props} /> )
}

export const EmptyList = ({ type }: { type: string }) => (
  <Text style={type === 'task' ? { ...Typography.smallSubHeader } : { ...Typography.xSmallSubHeader }}>No {type}s added.</Text>
) 

export const TopRightHeader = ({ onPress }) => (
  <Pressable onPress={onPress} style={{
    ...Spacing.flexRow, position: 'absolute', right: -5, top: 0,
  }}>
    <Text style={{ ...Typography.xSmallHeader, marginRight: 10 }}>Add</Text>
    <Image source={getActionIconSource('add')} style={{ ... UI.xSmallIcon }} />
  </Pressable>
)

export const FormLabel = ({ label, icon, width, top = 20, bottom = 10 }: { label: string, icon: string, width?: string | number, top?: number, bottom?:number }) => (
  <View style={{...Spacing.flexRow, width: width as DimensionValue, alignSelf: 'flex-start', marginTop: top, marginBottom: bottom }}>
    <Image source={getActionIconSource(icon)} style={{ ...UI.xSmallIcon, marginRight: 10 }} />
    <Text style={{ ...Typography.xSmallHeader, margin: 0 }}>{label}</Text>
  </View>
)

export const BottomModal = ({ children, modalVisible, height, maxHeight, onDismiss, background = Colors.shadow.lightest, overlay = Colors.white }: { children: ReactNode, modalVisible: boolean, height: string | number, maxHeight?: string | number, onDismiss: () => void, background?: string, overlay?: string }) => {
  const [childrenVisible, setChildrenVisible] = useState(modalVisible)

  const dismissModal = () => {
    setChildrenVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  useEffect(() => {
    setChildrenVisible(modalVisible)
  },[modalVisible])

  return (
    <Modal
      animationType='none' 
      visible={modalVisible}
      onRequestClose={() => setChildrenVisible(false)}
      onDismiss={onDismiss}
      transparent={true}
    > 
      <Pressable onPress={e => {
        if (e.target === e.currentTarget) dismissModal()
      }} style={{ ...UI.modalOverlay, backgroundColor: overlay}}>
        { childrenVisible && 
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{ ...UI.bottomModal, height: height as DimensionValue, maxHeight: maxHeight as DimensionValue, alignItems: 'center', backgroundColor: background }}>
            <GoBackButton position="topLeft" onPress={dismissModal} left={10} top={10} />
            { children }
          </Animated.View> 
        }
      </Pressable>
    </Modal>
  )
}

export const FormInput = forwardRef(({ value, placeholder, onChange, styles, props, maxLength = 50 }: { value: string, placeholder: string, onChange: (input: string) => void, styles: TextStyle, props: TextInputProps, maxLength?: number }, ref: MutableRefObject<any>) => {
  const [isFocused, setIsFocused] = useState(false)
  const focusedColor = isFocused ? Colors.pink.darkest : Colors.black
  
  return (
    <TextInput
      ref={ref}
      style={[styles ?? UI.input, { color: focusedColor, borderColor: focusedColor }]}
      placeholder={placeholder ?? 'Title'}
      placeholderTextColor={UI.lightPalette.unfocused}
      value={value}
      onChangeText={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      maxLength={maxLength}
      selectTextOnFocus={true}
      { ...props }
    />
  )
})

export const ModalInput = ({ children, label, onReset, height = 'fit-content', maxHeight, color, overlay, background }: { children: ReactNode, label: string | ReactElement, onReset: () => void, height?: number | string, maxHeight?: number | string, color?: number, overlay?: string, background?: string }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const focusedColor = Colors.multi.dark[color] ?? UI.lightPalette.focused
  const focusedStyles = { borderColor: focusedColor, color: focusedColor }
  const unfocusedStyles = { borderColor: UI.lightPalette.border, color: UI.lightPalette.text }

  const dismissModal = () => setModalVisible(false)

  return (
    <>
      <Pressable onPress={() => setModalVisible(!modalVisible)}>
        <Text style={[UI.input, modalVisible ? focusedStyles : unfocusedStyles]}>{label}</Text>
      </Pressable>

      <BottomModal modalVisible={modalVisible} onDismiss={dismissModal} height={height} maxHeight={maxHeight} overlay={overlay} background={background}>
        { children }
        <SubButton title='Reset' onPress={onReset} color={UI.lightPalette.unfocused} bottom={20} />
      </BottomModal>
    </>
  )
}

export const DateInput = ({ date, onChangeDate, color }: { date: Date, onChangeDate: (selected: Date) => void, color?: number }) => (
  <ModalInput label={date.toDateString()} onReset={() => onChangeDate(new Date())} color={color}>
    <RNDateTimePicker display="inline" themeVariant="light" value={new Date(date)} minimumDate={new Date()} onChange={(_, selectedDate) => onChangeDate(selectedDate)} accentColor={Colors.multi.dark[color]} />
  </ModalInput>
)

