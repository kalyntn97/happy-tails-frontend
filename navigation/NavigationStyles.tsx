import { GoBackButton } from "@components/ButtonComponent"
import { windowHeight } from "@home/helpers"
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { NativeStackHeaderProps, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Colors, Forms, Typography } from "@styles/index"
import { StyleSheet, Text, View } from "react-native"
import { moderateScale, moderateVerticalScale } from "react-native-size-matters"

const headerOptions: any = {
  headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
  headerStyle: { backgroundColor: Colors.shadow.lightest },
  headerTintColor: Colors.black,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.shadow.lightest },
}

export const TAB_BAR_HEIGHT = moderateVerticalScale(70, 1.5)

const Header = ({ title, navigation, showGoBackButton, mode }: { title?: string, navigation: any, showGoBackButton: boolean, mode: string }) => (
  title ? 
    <View style={[styles.headerCon, { marginTop: mode === 'card' ? 25 : 15 }]}>
      { showGoBackButton && <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={mode === 'card' ? 15 : 10} left={10} /> }
      { title && <Text style={styles.headerText}>{title}</Text>}
    </View> 
  : showGoBackButton && <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={mode === 'card' ? 45 : 15} left={10} />
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
  icon: { ...Forms.smallIcon },
  iconLabel: { fontWeight: 'bold', fontSize: 12 },
  headerText: {
    ...Typography.mediumHeader, color: Colors.pink.darkest,
  },
  headerCon: { 
    height: 70,
    backgroundColor: Colors.shadow.lightest,
  },
})