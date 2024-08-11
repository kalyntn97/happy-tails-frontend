import { ActivityIndicator, DimensionValue, Image, ImageStyle, Keyboard, KeyboardAvoidingView, KeyboardEventListener, Modal, Platform, Pressable, StyleSheetProperties, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { Spacing, Colors, Typography, UI } from "@styles/index"
import { ComponentProps, FC, MutableRefObject, ReactElement, ReactNode, forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getActionIconSource } from "@utils/ui"
import { ImageSourcePropType } from "react-native"
import { ToastConfig, ToastConfigParams, ToastOptions, ToastProps } from "react-native-toast-message"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { GoBackButton, IconButton, SubButton } from "./ButtonComponents"
import Animated, { FadeInDown, FadeOutDown, LayoutAnimationConfig, SlideInDown, SlideOutDown, ZoomInUp } from "react-native-reanimated"
import { useSelectPhoto } from "@hooks/sharedHooks"
import Fuse from "fuse.js"

type Size = 'small' | 'medium' | 'large' | 'xSmall' | 'xLarge'

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

export const BoxHeader = ({ title, onPress, titleColor, arrow, mode, titleIconSource, rightContent }: BoxHeaderProps) => (
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

export const BoxWithHeader = ({ title, titleIconSource, onPress, content, titleColor, arrow }: BoxProps) => (
  <View style={{ ...UI.roundedCon }}>
    <BoxHeader title={title} onPress={onPress} titleColor={titleColor} arrow={arrow} titleIconSource={titleIconSource}/>
    <View style={{
      width: '100%'
    }}>
      { content }
    </View>
  </View>
)

interface IconProps {
  iconSource: ImageSourcePropType
  size?: Size
  styles?: ImageStyle
}
interface CircleIconProps extends IconProps {
  bgColor?: string
}

const iconSize = {
  xSmall: UI.xSmallIcon,
  small: UI.smallIcon,
  medium: UI.icon,
  large: UI.largeIcon,
  xLarge: UI.xLargeIcon,
}

export const Icon = ({ iconSource, size = 'small', styles }: IconProps) =>  (
  <Image source={iconSource} style={[iconSize[size], styles]} />
)

export const CircleIcon = ({ iconSource, size = 'large', bgColor }: CircleIconProps) => (
  <View style={{ backgroundColor: bgColor ?? Colors.shadow.light, ...UI.roundedIconCon }}>
    <Icon iconSource={iconSource} size={size} />
  </View>
)

const photoSize = {
  medium: { width: 110, height: 130 },
  small: { width: 80, height: 100 },
  xSmall: { width: 50, height: 70 },
}

export const PhotoUpload = memo(({ photo, size = 'medium', placeholder, onSelect, styles }: { photo?: string, size?: Size, placeholder?: ImageSourcePropType, onSelect: (uri: string) => void, styles?: ViewStyle }) => {
  const photoSource: ImageSourcePropType = photo ? { uri: photo } : (placeholder ?? require('assets/icons/ui-image.png'))

  const addPhoto = async () => {
    const selected = await useSelectPhoto()
    onSelect(selected)
  }

  return (
    <View style={[styles, photoSize[size], { borderRadius: 15, position: 'relative', overflow: 'hidden', backgroundColor: Colors.shadow.light, elevation: 2 }]}>
      <Image source={photoSource} style={Spacing.fullWH as ImageStyle} />
      <TouchableOpacity onPress={addPhoto} style={[Spacing.centered, { position: 'absolute', width: '100%', height: '40%', bottom: 0 }]}>
        <View style={[Spacing.centered, { width: '90%', padding: 5, marginBottom: 5, borderRadius: 30, backgroundColor: Colors.transparent.light }]}>
          <Text style={{ fontSize: size === 'medium' ? 12 : 10 }}>{photo ? 'Edit' : 'Upload'} Photo</Text>
          <Icon iconSource={getActionIconSource('camera')} size="xSmall" />
        </View>
      </TouchableOpacity>
    </View>
  )
})

export const ErrorMessage = ({ error, styles }: { error: string, styles?: TextStyle }) => (
  <Text style={[Typography.errorMsg, styles]}>{error}</Text>
)

export const FormError = ({ errors, errorKey }: { errors: { [key: string]: string }, errorKey: string }) => (
  errorKey in errors && <ErrorMessage error={errors[errorKey]} />
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

export const Header = ({ title, size = 'medium', color = Colors.black, styles }: { title: string, size?: Size, color?: string, styles?: TextStyle }) => {
  const headerSize = {
    small: Typography.smallHeader,
    medium: Typography.mediumHeader,
    xSmall: Typography.xSmallHeader,
    large: Typography.subHeader,
    xLarge: Typography.mainHeader,
  }
  return (
    <Text style={[headerSize[size], styles, { color: color }]}>{title}</Text>
  )
}

export const TopRightHeader = ({ label, icon, onPress, top = 0, right = -5 }: { label: string, icon?: string, onPress: () => void, top?: number, right?: number }) => (
  <Pressable onPress={onPress} style={{
    ...Spacing.flexRow, position: 'absolute', right: right, top: top,
  }}>
    <Text style={{ ...Typography.xSmallHeader, marginRight: icon ? 10 : 0 }}>{label}</Text>
    { icon && <Icon iconSource={getActionIconSource(icon)} size='xSmall' /> }
  </Pressable>
)

export const FormLabel = ({ label, icon, width, top = 30, bottom = 10 }: { label: string, icon: string, width?: string | number, top?: number, bottom?:number }) => (
  <View style={{...Spacing.flexRow, width: width as DimensionValue, alignSelf: 'flex-start', marginTop: top, marginBottom: bottom }}>
    <Image source={getActionIconSource(icon)} style={{ ...UI.xSmallIcon, marginRight: 10 }} />
    <Text style={{ ...Typography.xSmallHeader, margin: 0 }}>{label}</Text>
  </View>
)

export const FormInput = memo(forwardRef(({ initial, placeholder, onChange, styles, props, maxLength = 100, width = '90%', error }: { initial: string, placeholder: string, onChange?: (input: string) => void, styles?: TextStyle, props?: TextInputProps, maxLength?: number, error?: string, width?: DimensionValue }, ref: MutableRefObject<any>) => {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState(initial ?? null)

  const validatedStyles = useMemo(() => error ? UI.inputError : isFocused ? UI.inputFocused : UI.inputUnfocused, [error, isFocused])

  return (
    <View style={{ zIndex: isFocused ? 10 : 2 }}>
      <TextInput
        ref={ref}
        style={[styles ?? UI.input, validatedStyles, { width: width }]}
        placeholder={placeholder ?? 'Title'}
        placeholderTextColor={UI.lightPalette().unfocused}
        value={value}
        onChangeText={setValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          onChange(value)
          setIsFocused(false)
        }}
        maxLength={maxLength}
        selectTextOnFocus={true}
        { ...props }
      />
      <View style={[Spacing.flexRow, { marginTop: 5 }]}>
        { error && <ErrorMessage error={error} styles={{ margin: 0, marginRight: 30 }}/> }
        { isFocused && 
          <Text style={{ color: UI.lightPalette().unfocused, fontSize: 12 }}>
            {maxLength - (value ? value.length : 0)}/{maxLength}
          </Text> 
        }
      </View>
    </View>
  )
}))

export const BottomModal = ({ children, modalVisible, height = 'fit-content', maxHeight = '95%', onDismiss, background = Colors.shadow.lightest, overlay = Colors.transparent.dark }: { children: ReactNode, modalVisible: boolean, height?: string | number, maxHeight?: string | number, onDismiss: () => void, background?: string, overlay?: string }) => {
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
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{ ...UI.bottomModal, height: height as DimensionValue, maxHeight: maxHeight as DimensionValue, backgroundColor: background }}>
            <GoBackButton onPress={dismissModal} />
            { children }
          </Animated.View> 
        }
      </Pressable>
    </Modal>
  )
}

export const ModalInput = ({ children, label, onReset, onClose, height = 'fit-content', maxHeight, overlay, background, buttonStyles, buttonTextStyles, buttonTextProps, customLabel }: { children: ReactNode, label?: string | ReactElement, onReset?: () => void, onClose?: () => void, height?: number | string, maxHeight?: number | string, overlay?: string, background?: string, buttonStyles?: ViewStyle, buttonTextStyles?: TextStyle, buttonTextProps?: any, customLabel?: ReactNode}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const dismissModal = () => setModalVisible(false)

  return (
    <>
      <Pressable onPress={() => setModalVisible(!modalVisible)} style={buttonStyles}>
        { customLabel ??
          <Text {...buttonTextProps} style={buttonTextStyles}>{label}</Text>
        }
      </Pressable> 

      <BottomModal modalVisible={modalVisible} onDismiss={() => {
        onClose && onClose()
        dismissModal()
      }} height={height} maxHeight={maxHeight} overlay={overlay} background={background}>
        { children }
        { onReset && <SubButton title='Reset' onPress={onReset} color={UI.lightPalette().unfocused} bottom={20} /> }
      </BottomModal>
    </>
  )
}

export const DateInput = ({ date, placeholder = 'No date selected', onChangeDate, color, buttonStyles, buttonTextStyles }: { date: Date, placeholder?: string, onChangeDate: (selected: Date) => void, color?: number, buttonStyles?: ViewStyle, buttonTextStyles?: TextStyle }) => (
  <ModalInput label={date?.toDateString() ?? placeholder} onReset={() => onChangeDate(new Date())} buttonStyles={buttonStyles} buttonTextStyles={buttonTextStyles}>
    <RNDateTimePicker display="inline" themeVariant="light" value={date ? new Date(date) : new Date()} onChange={(_, selectedDate) => onChangeDate(selectedDate)} accentColor={Colors.multi.dark[color]} />
  </ModalInput>
)

export const NoteInput = ({ notes, onChange, buttonStyles, buttonTextStyles }: { notes: string, onChange: (text: string) => void, buttonStyles?: ViewStyle, buttonTextStyles?: TextStyle }) => {
  const DEFAULT_HEIGHT = '30%'
  const [height, setHeight] = useState(DEFAULT_HEIGHT)
  
  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', () => {
      setHeight('70%')
    })
    const onHide = Keyboard.addListener('keyboardDidHide', () => {
      setHeight('30%')
    })
    return () => {
      onShow.remove()
      onHide.remove()
    }
  }, [])

  return (
    <ModalInput label={notes ?? 'No notes added.'} onReset={() => onChange(null)} buttonStyles={buttonStyles} buttonTextProps={{ numberOfLines: 2, ellipsizeMode: 'tail' }} buttonTextStyles={buttonTextStyles} height={height}>
      <FormInput initial={notes} placeholder="Enter notes" onChange={onChange} props={{ multiline: true, numberOfLines: 6,  }} styles={{ ...UI.input, width: '90%', minHeight: 100, maxHeight: '30%',marginTop: 20 }} />
    </ModalInput>
  )
}

export const TableForm = memo(({ table, withLabel = false, dependentRows }: { table: { key: string, icon: string, value: any, label?: string }[], withLabel?: boolean, dependentRows?: { [key: string]: boolean }}) => (
  <View style={{ ...UI.roundedCon, backgroundColor: Colors.white }}>
    {table.map(row => {
      let rowIsVisible = true
      if (dependentRows && dependentRows.hasOwnProperty(row.key)) rowIsVisible = dependentRows[row.key]
      
      return (
        rowIsVisible && 
        <View key={row.key} style={{ ...Spacing.flexRow, width: '100%', justifyContent: 'space-between', minHeight: 50 }}>
          <View style={Spacing.flexRow}>
            <Icon iconSource={getActionIconSource(row.icon)} size='xSmall' />
            { withLabel && <Text style={{ marginLeft: 5 }}>{row.label}</Text> }
          </View>
          <View style={{ maxWidth: '60%' }}>{row.value}</View>
        </View>
      )
    })}
  </View>
))