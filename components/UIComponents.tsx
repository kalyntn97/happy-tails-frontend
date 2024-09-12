import RNDateTimePicker from "@react-native-community/datetimepicker"
import { MutableRefObject, ReactElement, ReactNode, forwardRef, memo, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, DimensionValue, Image, ImageSourcePropType, ImageStyle, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, ScrollViewProps, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Animated, { SlideInDown, SlideInLeft, SlideOutDown, SlideOutLeft } from "react-native-reanimated"
//utils & hooks
import { useSelectPhoto } from "@hooks/sharedHooks"
import { windowWidth } from "@utils/constants"
import { IconType, getIconByType } from "@utils/ui"
//components 
import { CustomToast } from "@navigation/NavigationStyles"
import { ActionButton, GoBackButton } from "./ButtonComponents"
//styles
import { Colors, Spacing, Typography, UI } from "@styles/index"
import { textSizeMap } from "@styles/typography"
import { Size, icon, iconSizeMap, lightPalette } from "@styles/ui"

interface IconProps {
  type?: IconType
  name: string
  value?: any
  size?: Size
  styles?: ImageStyle
  m?: number
}

export const Icon = ({ type = 'action', name, value, size = 'small', styles, m }: IconProps) =>  {
  const source = getIconByType(type, name, value)
  return (
    <Image source={source} style={[icon(size, m), styles]} />
  )
}

export const CircleIcon = ({ type, name, size = 'large', bgColor = Colors.shadow.light }: IconProps & { bgColor?: string }) => { 
  const conWidth = Number(iconSizeMap[size].width) + (size === 'large' ? 30 : 15)
  return (
    <View style={[UI.roundedIconCon, { backgroundColor: bgColor, width: conWidth, height: conWidth }]}>
      <Icon type={type} name={name} size={size} />
    </View>
  )
}

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
  size?: Size
  rightLabel?: 'down' | 'next'
  color?: string
  titleStyles?: TextStyle
  containerStyles?: ViewStyle
  mode?: 'normal' | 'bold'
  capitalize?: boolean
}

const headerSize = {
  xSmall: Typography.smallSubHeader,
  small: Typography.smallHeader,
  med: Typography.subHeader,
  large: Typography.mainHeader,
  xLarge: Typography.largeHeader,
}

export const TitleLabel = memo(({ title, iconType = 'action', iconName, onPress, color = UI.lightPalette().text, rightAction, size = 'med', titleStyles, containerStyles, rightLabel, mode = 'normal', capitalize = true }: TitleLabelProps) => { 
  const sizes = useMemo(() => {
    const titleSize: Size = size === 'small' || size === 'med' ? 'small' : size === 'large' ? 'med' : 'large'
    const iconSize: Size = size === 'small' ? 'xSmall' : size === 'med' ? 'small' : size === 'large' ? 'med' : 'large'
    return { titleSize, iconSize }
  }, [size])
  return (
    <Pressable onPress={onPress} style={[UI.rowContent('space-between', 0), { position: 'relative' }, containerStyles]}>
      { iconName && <Icon type={iconType} name={iconName} size={sizes.iconSize} styles={{ marginVertical: 0, marginRight: 10 }}/> }
      { title && 
        <Text style={[textSizeMap[sizes.titleSize],
          { fontWeight: mode, color: color, margin: 0, textAlign: 'left', marginRight: 20, textTransform: capitalize ? 'capitalize' : 'none' },
          titleStyles,
        ]}>
        { title }
      </Text> }
      <View style={[Spacing.flexColumn, { marginLeft: 'auto', flex: 1, alignItems: 'flex-end' }]}>
        { rightAction ?? (rightLabel && <Icon name={rightLabel} size='xSmall' styles={{ marginLeft: 10 }} />) }
      </View>
    </Pressable>
  )
})

export const FormHeader = ({ title, size = 'med', color = lightPalette().text, styles, capitalize = false }: { title: string, size?: Size, color?: string, styles?: TextStyle, capitalize?: boolean }) => {
  // const defaultColor = size === 'small' || size === 'xSmall' ? lightPalette().unfocused : lightPalette().text
  return (
    <Text style={[headerSize[size], { color: color, textTransform: capitalize ? 'capitalize' : 'none' }, styles]}>{title}</Text>
  )
}

export const FormLabel = ({ label, icon, type = 'action', size, capitalize = false, containerStyles }: { label: string, icon?: string, type?: IconType, size?: TitleLabelProps['size'], capitalize?: boolean, containerStyles?: ViewStyle }) => (
  <TitleLabel title={label} iconName={icon} iconType={type} mode="bold" size={size} capitalize={capitalize} containerStyles={containerStyles} />
)

export const TopRightHeader = ({ label, icon, onPress, top = 0, right = -5 }: { label: string, icon?: string, onPress: () => void, top?: number, right?: number }) => (
  <Pressable onPress={onPress} style={[Spacing.flexRow, { position: 'absolute', right: right, top: top }]}>
    <FormHeader title={label} size='xSmall' styles={{ marginRight: icon ? 10 : 0 }} />
    { icon && <Icon name={icon} /> }
  </Pressable>
)

export const getHeaderActions = (onReset: () => void, isPending: boolean, handleValidate: () => void): { icon?: string, title?: string | ReactNode, onPress: () => void }[] => {
  return [
    { icon: 'reset', onPress: onReset },
    { title: isPending ? 
        <Text style={Spacing.flexRow}><ActivityIndicator /> Submitting...</Text>
        : 'Submit', 
      onPress: handleValidate },
  ]
}

export const HelperText = ({ text, styles }: { text: string, styles?: TextStyle }) => (
  <Text style={[Typography.subBody, Typography.unFocused, { marginVertical: 5 }, styles]}>{text}</Text>
)

export const ErrorMessage = ({ error, styles }: { error: string, styles?: TextStyle }) => (
  <Text style={[Typography.error, { marginTop: 5 }, styles]}>{error}</Text>
)

export const FormError = ({ errors, errorKey, styles }: { errors: { [key: string]: string }, errorKey: string, styles?: TextStyle }) => (
  errors && errorKey in errors && <ErrorMessage error={errors[errorKey]} styles={styles} />
)

export const ErrorImage = ({ top = 0 }: { top?: number }) => (
  <View style={[Spacing.centered, { marginTop: top }]}>
    <Image source={require('assets/images/error.png')} style={{ maxWidth: 300, resizeMode: 'contain' }} />
  </View>
)
interface BoxProps extends TitleLabelProps {
  children: ReactNode
  contentStyles?: ViewStyle
}

export const BoxWithHeader = memo(({ title, iconType = 'action', iconName, onPress, color = UI.lightPalette().text, rightAction, size = 'med', titleStyles, rightLabel = 'down', mode = 'bold', children, contentStyles, containerStyles }: BoxProps) => (
  <View style={[UI.card(), containerStyles]}>
    <TitleLabel size={size} onPress={onPress} title={title} iconType={iconType} iconName={iconName} color={color} rightAction={rightAction} titleStyles={titleStyles} rightLabel={rightLabel} mode={mode} />
    <View style={[{ flex: 1, paddingVertical: 10 }, contentStyles]}>{children}</View>
  </View>
))

interface TableProps extends TitleLabelProps{
  table: { key: string, icon: string, value: any, label?: string }[], 
  withTitle?: boolean, 
  dependentRows?: { [key: string]: boolean },
  tableStyles?: ViewStyle
  errors?: { [key: string]: string }
}

export const TableForm = memo(({ table, withTitle = true, dependentRows, size = 'small', tableStyles, titleStyles, containerStyles, errors }: TableProps) => (
  <View style={[UI.card(true, false, 15), { backgroundColor: Colors.white }, tableStyles]}>
    { table.map((row, index) => {
      let rowIsVisible = true
      if (dependentRows && dependentRows.hasOwnProperty(row.key)) rowIsVisible = dependentRows[row.key]

      return (
        rowIsVisible && 
          <TitleLabel key={row.key} title={withTitle ? row.label : null} iconName={row.icon} size={size} rightAction={
            <View style={{ alignItems: 'flex-end' }}>
              { row.value }
              { errors && <FormError errorKey={row.key} errors={errors} /> }
            </View>
          } titleStyles={titleStyles} containerStyles={{ ...(index > 0 ? { borderTopWidth: 1, borderColor: lightPalette().border } : {}), minHeight: 50, zIndex: table.length - index, ...containerStyles }} />
      )
    })}
  </View>
))

export const EmptyList = ({ type }: { type: string }) => (
  <FormHeader title={`No ${type}s added.`} size={type === 'task' ? 'med' : 'small'} />
)

interface ScrollProps {
  children: ReactNode
  props?: ScrollViewProps
  contentStyles?: ViewStyle
  containerStyles?: ViewStyle
  h?: number, b?: number, t?: number
}

export const ScrollHeader = forwardRef<ScrollView, ScrollProps>(({ children, h = 10, b = 15, t = 15, containerStyles, contentStyles, props }, ref) => (
  <View style={[Spacing.flexRow, Spacing.basePadding(h, 0, b, t), containerStyles]}>
    <ScrollView 
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[Spacing.flexRow, contentStyles]}
      alwaysBounceHorizontal={false}
      { ...props }
    >
      { children }
    </ScrollView>
  </View>
))

export const ScrollContainer = ({ children, props, contentStyles }: ScrollProps) => (
  <ScrollView
    keyboardShouldPersistTaps='handled'
    alwaysBounceVertical={false} 
    showsVerticalScrollIndicator={false} 
    style={{ width: '100%' }} 
    contentContainerStyle={[{ flexGrow: 1 }, contentStyles ?? UI.form(10, 60)]}
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

interface InputProps {
  initial: string, 
  placeholder?: string, 
  onChange?: (input: string) => void,
  onFocus?: (py: number) => void
  onBlur?: () => void
  props?: TextInputProps, 
  maxLength?: number, 
  error?: string, 
  width?: DimensionValue
  withBorder?: boolean
  styles?: TextStyle
  align?: 'left' | 'right'
  bottom?: number
  type?: 'none' | 'password'
}

export const FormInput = memo(forwardRef(({ initial, placeholder = 'Enter title', onChange, onFocus, onBlur, props, maxLength = 100, width, error, withBorder = true, styles, align = 'left', bottom, type = 'none' }: InputProps, ref: MutableRefObject<any>) => {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState(initial)
  const [isSecure, setIsSecure] = useState(type === 'password' ? true : false)

  const validatedStyles = useMemo(() => error ? UI.error : isFocused ? UI.focused : UI.unfocused, [error, isFocused])

  const handlePress = (text: string) => {
    const validText = text?.trim().length === 0 ? null : text
    setValue(validText)
    onChange(validText)
    setIsFocused(false)
    Keyboard.dismiss()
  }

  const handleFocus = () => {
    if (ref?.current && onFocus) {
      ref.current.measure((_fx, _fy, _w, h, _px, py) => {
        onFocus(py + h)
      })
    }
    setIsFocused(true)
  }

  const handleBlur = () => {
    handlePress(value)
    if (onBlur) onBlur()
  }

  useEffect(() => {
    setValue(initial)
  }, [initial])

  return (
    <View style={[Spacing.flexColumn, { width: width, minWidth: 50, zIndex: isFocused ? 10 : 2, alignItems: withBorder ? (align === 'left' ? 'flex-start' : 'flex-end') : 'center' }]}>
      <View
        style={[Spacing.flexRow, withBorder ? UI.input() : { ...UI.input(false, 0, 0, 0), textAlign: align }, { width: '100%', height: 50 }, validatedStyles, styles]}
      >
        <TextInput
          ref={ref}
          style={{ flex: 1 }}
          placeholder={placeholder}
          placeholderTextColor={UI.lightPalette().unfocused}
          value={value}
          onChangeText={(text: string) => setValue(text)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          selectTextOnFocus={true}
          secureTextEntry={ isSecure ? true : false }
          { ...props }
        />
        { type === 'password' && <ActionButton icon={isSecure ? 'hide' : 'show'} onPress={() => setIsSecure(!isSecure)} size='xSmall' /> }
      </View>
      <View style={[Spacing.flexRow, { position: 'absolute', bottom: bottom ?? (withBorder ? -20 : -15) }]}>
        { error && <ErrorMessage error={error} styles={{ margin: 0, marginRight: isFocused ? 30 : 0 }}/> }
        <Text style={{ color: UI.lightPalette().unfocused, fontSize: 12 }}>
          { isFocused && `${maxLength - (value ? value.length : 0)}/${maxLength}` }
        </Text> 
        
      </View>
    </View>
  )
}))

export  const InlinePicker = ({ options, onSelect, selected, width = '80%' }: { options: string[], onSelect: (selected: String) => void, selected: string, width?: DimensionValue }) => (
  <View style={[Spacing.flexRow, { justifyContent: 'space-between', width: width }]}>
    {options.map(option =>
      <TouchableOpacity key={option} onPress={() => onSelect(option)} style={{ opacity: selected === option ? 1 : 0.3 }}>
        <Text>{option}</Text>
      </TouchableOpacity>
    )}
  </View>
)

interface ModalProps {
  children: ReactNode, 
  modalVisible: boolean, 
  height?: DimensionValue, 
  maxHeight?: DimensionValue, 
  onDismiss: () => void, 
  background?: string, 
  overlay?: string
  animation?: 'horizontal' | 'vertical'
}

export const BottomModal = ({ children, modalVisible, height = 'fit-content' as DimensionValue, maxHeight = '93.5%', onDismiss, background = Colors.shadow.lightest, overlay = Colors.transparent.dark, animation = 'vertical'}: ModalProps) => {
  const [childrenVisible, setChildrenVisible] = useState(modalVisible)

  const dismissModal = () => {
    setChildrenVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  useEffect(() => {
    setChildrenVisible(modalVisible)
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', dismissModal)

    return () => {
      keyboardWillHideListener.remove()
    }
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
          <KeyboardAvoidingView
            style={{ marginTop: 'auto' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Animated.ScrollView 
              entering={animation === 'vertical' ? SlideInDown : SlideInLeft} 
              exiting={animation === 'vertical' ? SlideOutDown : SlideOutLeft} 
              style={[UI.bottomModal, { width: windowWidth, height: height as DimensionValue, maxHeight: maxHeight as DimensionValue, backgroundColor: background }]}
              contentContainerStyle={[UI.form(10, 60, 40), { flexGrow: 1 }]}
              alwaysBounceVertical={false}
              keyboardShouldPersistTaps='handled'
            >
              <GoBackButton onPress={dismissModal} />
              { children }
            </Animated.ScrollView> 
          </KeyboardAvoidingView>
        }
      </Pressable>

      <CustomToast />
    </Modal>
  )
}

interface ModalInputProps {
  label?: string | ReactElement, 
  onReset?: () => void, 
  onDismiss?: () => void,
  onSubmit?: () => void,
  buttonStyles?: ViewStyle, 
  buttonTextStyles?: TextStyle, 
  buttonTextProps?: any, 
  customLabel?: ReactNode
  children?: ReactNode, 
  height?: DimensionValue, 
  maxHeight?: DimensionValue, 
  background?: string, 
  overlay?: string
  animation?: 'horizontal' | 'vertical'
}

export const ModalInput = ({ children, label, onReset, onDismiss, onSubmit, height, maxHeight, overlay, background, buttonStyles, buttonTextStyles, buttonTextProps, customLabel, animation }: ModalInputProps) => {
  const [modalVisible, setModalVisible] = useState(false)

  const dismissModal = () => {
    setModalVisible(false)
    onDismiss && onDismiss()
  }

  return (
    <>
      <Pressable onPress={() => setModalVisible(!modalVisible)} style={buttonStyles}>
        { customLabel 
          ? customLabel :
          <Text {...buttonTextProps} style={buttonTextStyles}>{label}</Text>
        }
      </Pressable> 
      
      <BottomModal modalVisible={modalVisible} onDismiss={dismissModal} height={height} maxHeight={maxHeight} overlay={overlay} background={background} animation={animation}>
        <View style={[Spacing.flexRow, { maxWidth: '80%', justifyContent: 'space-between', position: 'absolute', right: 10, top: 10, }]}>
          { onReset && <ActionButton icon='reset' onPress={onReset} buttonStyles={{ marginRight: onSubmit ? 30 : 0 }} /> }
          { onSubmit && <ActionButton title='Save' size='xSmall' onPress={() => {
            onSubmit()
            dismissModal()
          }} /> }
        </View>
        { children }
      </BottomModal>
    </>
  )
}

interface DateInputProps extends ModalInputProps {
  date: Date | string, 
  placeholder?: string, 
  onChangeDate: (selected: string) => void, 
  color?: number, 
  header?: string
}

export const DateInput = ({ date, placeholder = 'No date selected.', onChangeDate, color, buttonStyles, buttonTextStyles, header }: DateInputProps) => (
  <ModalInput label={date ? new Date(date).toLocaleDateString() : placeholder} onReset={() => onChangeDate(new Date().toISOString())} buttonStyles={buttonStyles} buttonTextStyles={buttonTextStyles}>
    { header && 
      <FormHeader title={date ? `${header}: ${new Date(date).toLocaleDateString()}` : header} /> 
    }
    <RNDateTimePicker display="inline" themeVariant="light" value={date ? new Date(date) : new Date()} onChange={(_, selectedDate) => onChangeDate(selectedDate.toISOString())} accentColor={Colors.multi.dark[color]} />
  </ModalInput>
)

interface NoteInputProps extends ModalInputProps {
  notes: string, 
  maxLength?: number, 
  onChange: (text: string) => void, 
  inputStyles?: TextStyle, 
  placeholder?: string, 
  header?: string, 
  subHeading?: ReactNode
}

export const NoteInput = ({ notes: initial, maxLength = 100, onChange, onSubmit, buttonStyles, buttonTextStyles, inputStyles, placeholder, header, subHeading, customLabel, height = '15%', maxHeight, overlay = Colors.white }: NoteInputProps) => {
  const [notes, setNotes] = useState(initial)
  const [isFocused, setIsFocused] = useState(false)

  const validatedStyles = useMemo(() => isFocused ? UI.focused : UI.unfocused, [isFocused])

  const handlePress = (text: string) => {
    const validText = text && text.trim().length === 0 ? null : text
    setNotes(validText)
    onChange(validText)
    setIsFocused(false)
    Keyboard.dismiss()
  }

  return (
    <ModalInput customLabel={customLabel} label={notes?.length ? notes : 'No notes added.'} onSubmit={onSubmit} onReset={() => handlePress(null)} buttonStyles={buttonStyles} buttonTextProps={{ numberOfLines: 2, ellipsizeMode: 'tail' }} buttonTextStyles={buttonTextStyles} overlay={overlay}>
      <FormHeader title={header ?? 'Add Notes'} />
      { subHeading }

      <View style={[Spacing.flexRowStretch, UI.input(), { width: '90%', minHeight: height, maxHeight: maxHeight }, validatedStyles, inputStyles]}>
        <TextInput
          style={{ height: '100%', flex: 1, marginRight: 10 }}
          placeholder={placeholder ?? 'Enter notes'}
          placeholderTextColor={UI.lightPalette().unfocused}
          value={notes}
          onChangeText={setNotes}
          onFocus={() => setIsFocused(true)}
          onBlur={() => handlePress(notes)}
          maxLength={maxLength}
          selectTextOnFocus={true}
          multiline={true}
          numberOfLines={6}
          autoFocus={true}
        />
        <Icon name='edit' size='xSmall' />
      </View>

    </ModalInput>
  )
}