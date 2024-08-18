import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { moderateVerticalScale } from "react-native-size-matters"
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
//components
import { GoBackButton } from "@components/ButtonComponents"
//styles
import { Colors, UI, Typography, Spacing } from "@styles/index"
import { getActionIconSource } from "@utils/ui"
import { oastConfig } from "@components/UIComponents"
import Toast, { ToastConfigParams } from "react-native-toast-message"

export const TAB_BAR_HEIGHT = moderateVerticalScale(70, 1.5)

const headerOptions: any = {
  headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
  headerStyle: { backgroundColor: Colors.shadow.lightest },
  headerTintColor: Colors.black,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.shadow.lightest },
}

export const tabBarOptions: BottomTabNavigationOptions = {
  tabBarStyle: { padding : 10, height: TAB_BAR_HEIGHT, backgroundColor: Colors.white },
  headerShown: false,
}

const RightButton = ({ title, icon, onPress, buttonStyles }: { title?: string, icon?: string, onPress: () => void, buttonStyles?: ViewStyle }) => (
  <TouchableOpacity onPress={onPress} style={buttonStyles}>
    { icon && <Image source={getActionIconSource(icon)} style={{ width: 25, height: 25 }} /> }
    { title && <Text style={styles.buttonText}>{title}</Text> }
  </TouchableOpacity>
)

export const Header = ({ title, navigation, showGoBackButton, mode, rightActions, bgColor = Colors.shadow.lightest }: { title?: string, navigation: any, showGoBackButton: boolean, mode: string, rightActions?: { title?: string, icon?: string, onPress: () => void }[], bgColor?: string }) => (
  <View style={[styles.headerCon, { height: title ? 70 : 50, paddingTop: mode === 'card' ? 25 : 15, backgroundColor: bgColor }]}>
    { showGoBackButton && <GoBackButton onPress={() => navigation.goBack()} /> }
    { title && <Text style={styles.headerText}>{title}</Text> }
    {rightActions && 
      <View style={[styles.headerRight, { top: mode === 'card' ? 25 : 15 }]}>
        { rightActions.map(action =>
          <RightButton key={action.title || action.icon} title={action.title} icon={action.icon} onPress={action.onPress} buttonStyles={{ marginLeft: 50 }}/>      
        )}
      </View> 
    }
    { mode === 'modal' && <CustomToast /> }
  </View> 
)

export const dynamicStackOptions = (mode: 'modal' | 'card' = 'modal', showGoBackButton = true, showTitle = true): NativeStackNavigationOptions => {
  return {
    ...headerOptions,
    presentation: mode,
    gestureEnabled: true,
    ...contentStyle,
    header: ({ navigation, options }) => <Header title={showTitle && options.title} navigation={navigation} mode={mode} showGoBackButton={showGoBackButton} />
  }
}

export const CatToast = ({ text1, text2, props }: { text1: string, text2: string, props: any }) => (
  <View style={[Spacing.flexRow, UI.boxShadow, { borderRadius: 6, paddingHorizontal: 15, paddingVertical: 10, width: '90%', minHeight: 70, backgroundColor: props.style === 'success' ? Colors.green.lightest : props.style === 'info' ? Colors.yellow.lightest : Colors.red.lightest }]}>
    <Image source={props.style === 'error' ? require('assets/icons/ui-cat-sad.png') : require('assets/icons/ui-cat-happy.png')} style={UI.icon()} />
    <View style={[Spacing.flexColumn, { marginLeft: 10, alignItems: 'flex-start' }]}>  
      <Text style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>{props.style}</Text>
      <Text>{text1}</Text>
      { text2 && <Text style={{ flex: 1 }}>{text2}</Text> }
    </View>
    <Pressable style={{ marginLeft: 'auto' }} onPress={props.onClose}>
      <Image source={getActionIconSource('close')} style={UI.icon()} />
    </Pressable>
  </View>
)

export const toastConfig = {
  catToast: ({ text1, text2, props }: ToastConfigParams<any>) => ( <CatToast text1={text1} text2={text2} props={props} /> )
}

export const CustomToast = () => (
  <Toast config={toastConfig} />
)

export const styles = StyleSheet.create({
  icon: { ...UI.icon() },
  iconLabel: { fontWeight: 'bold', fontSize: 12 },
  headerCon: {
    paddingTop: 25,
  },
  headerText: {
    ...Typography.subHeader, 
    color: Colors.pink.darkest,
    margin: 0,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.black,
  },
  headerRight: {
    ...Spacing.flexRow,
    position: 'absolute',
    right: 20,
  }
})