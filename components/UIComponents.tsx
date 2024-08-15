import RNDateTimePicker from "@react-native-community/datetimepicker"
import { MutableRefObject, ReactElement, ReactNode, forwardRef, memo, useEffect, useMemo, useState } from "react"
import { DimensionValue, Image, ImageSourcePropType, ImageStyle, Keyboard, Modal, Pressable, ScrollView, ScrollViewProps, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"
//utils & hooks
import { useSelectPhoto } from "@hooks/sharedHooks"
import { IconType, getIconByType } from "@utils/ui"
import { ToastConfigParams } from "react-native-toast-message"
//components 
import { GoBackButton, SubButton } from "./ButtonComponents"
//styles
import { Colors, Spacing, Typography, UI } from "@styles/index"
import { Size, icon, lightPalette } from "@styles/ui"

interface IconProps {
  type?: IconType
  name: string
  size?: Size
  styles?: ImageStyle
}

export const Icon = ({ type = 'action', name, size = 'small', styles }: IconProps) =>  {
  const source = getIconByType(type, name)
  return (
    <Image source={source} style={[icon(size), styles]} />
  )
}

export const CircleIcon = ({ type, name, size = 'large', bgColor }: IconProps & { bgColor?: string }) => (
  <View style={{ backgroundColor: bgColor ?? Colors.shadow.light, ...UI.roundedIconCon }}>
    <Icon type={type} name={name} size={size} />
  </View>
)

export const PhotoUpload = memo(({ photo, size = 'large', placeholder, onSelect, styles }: { photo?: string, size?: Size, placeholder?: ImageSourcePropType, onSelect: (uri: string) => void, styles?: ViewStyle }) => {
  const photoSource: ImageSourcePropType = photo ? { uri: photo } : (placeholder ?? require('assets/icons/ui-image.png'))

  const addPhoto = async () => {
    const selected = await useSelectPhoto()
    onSelect(selected)
  }

  return (
    <View style={[styles, UI.photo(size, 15, 0), { position: 'relative', overflow: 'hidden', backgroundColor: Colors.shadow.light, elevation: 2 }]}>
      <Image source={photoSource} style={Spacing.fullWH as ImageStyle} />
      <TouchableOpacity onPress={addPhoto} style={[Spacing.centered, { position: 'absolute', width: '100%', height: '30%', bottom: 0 }]}>
        <View style={[Spacing.centered, { width: '90%', padding: 5, marginBottom: 5, borderRadius: 30, backgroundColor: Colors.transparent.light }]}>
          <Text style={{ fontSize: size === 'med' ? 12 : 10 }}>{photo ? 'Edit' : 'Upload'} Photo</Text>
          <Icon name='camera' size='xSmall' />
        </View>
      </TouchableOpacity>
    </View>
  )
})

type TitleLabelProps = {
  onPress?: () => void
  title?: string
  iconType?: IconType
  iconName?: string
  rightAction?: ReactNode | any
  size?: 'small' | 'med'
  rightLabel?: 'down' | 'next'
  color?: string
  titleStyles?: TextStyle
  containerStyles?: ViewStyle
  mode?: 'normal' | 'bold'
}

export const TitleLabel = memo(({ title, iconType = 'action', iconName, onPress, color = UI.lightPalette().text, rightAction, size = 'med', titleStyles, containerStyles, rightLabel, mode = 'normal' }: TitleLabelProps) => { 
  const dynamicSize: { icon: Size, title: number } = useMemo(() => ({
    icon: size === 'small' ? 'xSmall' : 'small',
    title: size === 'small' ? 15 : 18,
  }), [size])
  
  return (
    <Pressable onPress={onPress} style={[UI.rowContent(true, 'space-between', 0), containerStyles]}>
      { iconName && <Icon type={iconType} name={iconName} size={dynamicSize.icon} styles={{ marginVertical: 0, marginRight: 10 }}/> }
      { title && 
        <Text style={[
          { fontWeight: mode, fontSize: dynamicSize.title, color: color, margin: 0, textAlign: 'left', marginRight: 20, textTransform: 'capitalize' },
          titleStyles,
        ]}>
        { title }
      </Text> }
      <View style={[Spacing.flexRow, { marginLeft: 'auto', flex: 1, justifyContent: 'flex-end' }]}>
        { rightAction ?? (rightLabel && <Icon name={rightLabel} size='xSmall' styles={{ marginLeft: 10 }} />) }
      </View>
    </Pressable>
  )
})

const headerSize = {
  xSmall: Typography.smallSubHeader,
  small: Typography.smallHeader,
  med: Typography.subHeader,
  large: Typography.mainHeader,
  xLarge: Typography.largeHeader,
}

export const FormHeader = ({ title, size = 'med', color = lightPalette().text, styles }: { title: string, size?: Size, color?: string, styles?: TextStyle }) => {
  // const defaultColor = size === 'small' || size === 'xSmall' ? lightPalette().unfocused : lightPalette().text
  return (
    <Text style={[headerSize[size], { color: color, textTransform: 'capitalize' }, styles]}>{title}</Text>
  )
}

export const FormLabel = ({ label, icon }: { label: string, icon: string }) => (
  <TitleLabel title={label} iconName={icon} titleStyles={{ ...Typography.smallHeader, margin: 0 }} />
)

export const TopRightHeader = ({ label, icon, onPress, top = 0, right = -5 }: { label: string, icon?: string, onPress: () => void, top?: number, right?: number }) => (
  <Pressable onPress={onPress} style={[Spacing.flexRow, { position: 'absolute', right: right, top: top }]}>
    <FormHeader title={label} size='xSmall' styles={{ marginRight: icon ? 10 : 0 }} />
    { icon && <Icon name={icon} /> }
  </Pressable>
)

export const ErrorMessage = ({ error, styles }: { error: string, styles?: TextStyle }) => (
  <Text style={[Typography.error, { margin: 5 }, styles]}>{error}</Text>
)

export const FormError = ({ errors, errorKey }: { errors: { [key: string]: string }, errorKey: string }) => (
  errorKey in errors && <ErrorMessage error={errors[errorKey]} />
)

export const ErrorImage = ({ top = 0 }: { top?: number }) => (
  <View style={[Spacing.centered, { marginTop: top }]}>
    <Image source={require('assets/images/error.png')} style={{ maxWidth: 300, resizeMode: 'contain' }} />
  </View>
)

export const CatToast = ({ text1, text2, props }: { text1: string, text2: string, props: any }) => (
  <View style={[Spacing.flexRow, UI.boxShadow, { backgroundColor: Colors.white, borderRadius: 6, paddingHorizontal: 15, paddingVertical: 10, width: '90%', minHeight: 70, shadowColor: props.style === 'success' ? Colors.green.dark : Colors.red.dark }]}>
    <Image source={props.style === 'success' ? require('assets/icons/ui-cat-happy.png') : require('assets/icons/ui-cat-sad.png')} style={{ ...UI.icon()}} />
    <View style={[Spacing.flexColumn, { marginLeft: 10, alignItems: 'flex-start' }]}>  
      <Text style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>{props.style}!</Text>
      <Text>{text1}</Text>
      { text2 && <Text style={{ flex: 1 }}>{text2}</Text> }
    </View>
    <Pressable style={{ marginLeft: 'auto' }} onPress={props.onClose}>
      <Icon name='close' size='small' />
    </Pressable>
  </View>
)

export const toastConfig = {
  catToast: ({ text1, text2, props }: ToastConfigParams<any>) => ( <CatToast text1={text1} text2={text2} props={props} /> )
}

interface BoxProps extends TitleLabelProps {
  children: ReactNode
  contentStyles?: ViewStyle
}

export const BoxWithHeader = memo(({ title, iconType = 'action', iconName, onPress, color = UI.lightPalette().text, rightAction, size = 'med', titleStyles, rightLabel = 'down', children, contentStyles }: BoxProps) => (
  <View style={UI.card()}>
    <TitleLabel size={size} onPress={onPress} title={title} iconType={iconType} iconName={iconName} color={color} rightAction={rightAction} titleStyles={titleStyles} rightLabel={rightLabel} />
    <View style={[{ flex: 1, paddingVertical: 10 }, contentStyles]}>{children}</View>
  </View>
))

interface TableProps extends TitleLabelProps{
  table: { key: string, icon: string, value: any, label?: string }[], 
  withTitle?: boolean, 
  dependentRows?: { [key: string]: boolean },
  tableStyles?: ViewStyle 
}

export const TableForm = memo(({ table, withTitle = false, dependentRows, size = 'small', tableStyles, titleStyles, containerStyles }: TableProps) => (
  <View style={[UI.card(), { backgroundColor: Colors.white }, tableStyles]}>
    { table.map((row, index) => {
      let rowIsVisible = true
      if (dependentRows && dependentRows.hasOwnProperty(row.key)) rowIsVisible = dependentRows[row.key]

      return (
        rowIsVisible && 
          <TitleLabel key={row.key} title={withTitle ? row.label : null} iconName={row.icon} size={size} rightAction={row.value} titleStyles={titleStyles} 
            containerStyles={{ ...(index < table.length - 1 ? UI.tableRow(true) : {}), minHeight: 50, ...containerStyles }} 
          />
      )
    })}
  </View>
))

export const EmptyList = ({ type }: { type: string }) => (
  <Text style={type === 'task' ? { ...Typography.smallSubHeader } : { ...Typography.xSmallSubHeader }}>No {type}s added.</Text>
)

interface ScrollProps {
  children: ReactNode
  props?: ScrollViewProps
  contentStyles?: ViewStyle
}

export const ScrollContainer = ({ children, props, contentStyles }: ScrollProps) => (
  <ScrollView
    keyboardShouldPersistTaps='handled'
    alwaysBounceVertical={false} 
    showsVerticalScrollIndicator={false} 
    style={{ width: '100%' }} 
    contentContainerStyle={contentStyles ?? UI.form(10, 60)}
    { ...props }
  >
    { children }
  </ScrollView>
)

export const ScrollScreen = ({ children, props, contentStyles, containerStyles, bgColor = UI.lightPalette().background }: ScrollProps & { containerStyles?: ViewStyle, bgColor?: string }) => (
  <View style={[Spacing.fullCon(), { backgroundColor: bgColor }, containerStyles]}>
    <ScrollContainer props={props} contentStyles={contentStyles}>{children}</ScrollContainer>
  </View>
)

export const FormInput = memo(forwardRef(({ initial, placeholder, onChange, styles, props, maxLength = 100, width = '80%', error }: { initial: string, placeholder: string, onChange?: (input: string) => void, styles?: TextStyle, props?: TextInputProps, maxLength?: number, error?: string, width?: DimensionValue }, ref: MutableRefObject<any>) => {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState(initial ?? null)

  const validatedStyles = useMemo(() => error ? UI.error : isFocused ? UI.focused : UI.unfocused, [error, isFocused])

  return (
    <View style={{ width: width, zIndex: isFocused ? 10 : 2 }}>
      <TextInput
        ref={ref}
        style={[styles ?? UI.input(), validatedStyles]}
        placeholder={placeholder ?? 'Title'}
        placeholderTextColor={UI.lightPalette().unfocused}
        value={value}
        onChangeText={(text: string) => setValue(text)}
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
      onRequestClose={dismissModal}
      onDismiss={onDismiss}
      transparent={true}
    > 
      <Pressable onPress={e => {
        if (e.target === e.currentTarget) dismissModal()
      }} style={[UI.modalOverlay, { backgroundColor: overlay}]}>
        { childrenVisible && 
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={[UI.bottomModal, { height: height as DimensionValue, maxHeight: maxHeight as DimensionValue, backgroundColor: background }]}>
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
        { onReset && <SubButton title='Reset' onPress={onReset} color={UI.lightPalette().unfocused} buttonStyles={{ marginBottom: 20 }} /> }
      </BottomModal>
    </>
  )
}

export const DateInput = ({ date, placeholder = 'No date selected', onChangeDate, color, buttonStyles, buttonTextStyles, header }: { date: Date | string, placeholder?: string, onChangeDate: (selected: string) => void, color?: number, buttonStyles?: ViewStyle, buttonTextStyles?: TextStyle, header?: string }) => (
  <ModalInput label={date ? new Date(date).toLocaleDateString() : placeholder} onReset={() => onChangeDate(new Date().toISOString())} buttonStyles={buttonStyles} buttonTextStyles={buttonTextStyles}>
    { header && <FormHeader title={date ? `${header}: ${new Date(date).toLocaleDateString()}` : header} />}
    <RNDateTimePicker display="inline" themeVariant="light" value={date ? new Date(date) : new Date()} onChange={(_, selectedDate) => onChangeDate(selectedDate.toISOString())} accentColor={Colors.multi.dark[color]} />
  </ModalInput>
)

export const NoteInput = ({ notes, maxLength = 100, onChange, buttonStyles, buttonTextStyles, inputStyles, placeholder, header }: { notes: string, maxLength?: number, onChange: (text: string) => void, buttonStyles?: ViewStyle, buttonTextStyles?: TextStyle, inputStyles?: TextStyle, placeholder?: string, header?: string }) => {
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
      <FormHeader title={header ?? 'Add Note'} />

      <TextInput
        style={[UI.input(), { width: '90%', minHeight: 100, maxHeight: '30%' }, inputStyles]}
        placeholder={placeholder ?? 'Enter notes'}
        placeholderTextColor={UI.lightPalette().unfocused}
        value={notes}
        onChangeText={onChange}
        maxLength={maxLength}
        selectTextOnFocus={true}
        multiline={true}
        numberOfLines={6}
      />
    </ModalInput>
  )
}