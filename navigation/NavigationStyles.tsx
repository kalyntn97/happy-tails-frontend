import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { moderateVerticalScale } from "react-native-size-matters"
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
//components
import { GoBackButton } from "@components/ButtonComponent"
//styles
import { Colors, UI, Typography } from "@styles/index"

const headerOptions: any = {
  headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
  headerStyle: { backgroundColor: Colors.shadow.lightest },
  headerTintColor: Colors.black,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.shadow.lightest },
}

const RightButton = ({ title, onPress, buttonStyles }: { title: string, onPress: () => void, buttonStyles?: ViewStyle }) => (
  <TouchableOpacity onPress={onPress} style={[styles.headerRight, buttonStyles]}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
)

export const TAB_BAR_HEIGHT = moderateVerticalScale(70, 1.5)

export const Header = ({ title, navigation, showGoBackButton, mode, rightLabel = 'Submit', rightAction }: { title?: string, navigation: any, showGoBackButton: boolean, mode: string, rightLabel?: string, rightAction?: () => void }) => (
  title ? 
    <View style={[styles.headerCon, { marginTop: mode === 'card' ? 25 : 15 }]}>
      { showGoBackButton && <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={mode === 'card' ? 15 : 10} left={10} /> }
      { title && <Text style={styles.headerText}>{title}</Text> }
      { rightAction && <RightButton title={rightLabel} onPress={rightAction} buttonStyles={{ top: mode === 'card' ? 25 : 20 }} />      
      }
    </View> 
  : showGoBackButton && 
    <>
      <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={mode === 'card' ? 45 : 15} left={10} />
      { rightAction && <RightButton title={rightLabel} onPress={rightAction} buttonStyles={{ top: mode === 'card' ? 55 : 25 }} />
      }
    </>
)

export const dynamicStackOptions = (mode: string = 'modal', showGoBackButton: boolean = true, showTitle: boolean = true): NativeStackNavigationOptions => {
  return {
    ...headerOptions,
    presentation: mode,
    gestureEnabled: true,
    ...contentStyle,
    header: ({ navigation, options }) => <Header title={showTitle && options.title} navigation={navigation} mode={mode} showGoBackButton={showGoBackButton} />
  }
}

export const tabBarOptions: BottomTabNavigationOptions = {
  tabBarStyle: { padding : 10, height: TAB_BAR_HEIGHT, backgroundColor: Colors.white },
  headerShown: false,
}

export const styles = StyleSheet.create({
  icon: { ...UI.smallIcon },
  iconLabel: { fontWeight: 'bold', fontSize: 12 },
  headerText: {
    ...Typography.mediumHeader, 
    color: Colors.pink.darkest,
    margin: 0,
  },
  headerCon: { 
    height: 70,
    paddingTop: 25,
    backgroundColor: Colors.shadow.lightest,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.black,
  },
  headerRight: {
    position: 'absolute',
    right: 15,
  }
})