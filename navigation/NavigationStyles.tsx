import { GoBackButton } from "@components/ButtonComponent"
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Colors, Forms, Typography } from "@styles/index"
import { StyleSheet, Text, View } from "react-native"

const headerOptions: any = {
  headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
  headerStyle: { backgroundColor: Colors.shadow.lightest },
  headerTintColor: Colors.black,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.shadow.lightest },
}

const Header = ({ title, navigation, top }: { title: string, navigation: any, top?: number }) => (
  <View style={[styles.headerCon, top && { marginTop: top }]}>
    <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={10} left={10} />
    <Text style={styles.headerText}>{title}</Text>
  </View>
)

const TitleOnlyHeader = ({ title, top }: { title: string, top?: number }) => (
  <View style={[styles.headerCon, { marginTop: top ?? 50 }]}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
)

const NoTitleHeader = ({ navigation, top }) => (
  <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={top} left={10} />
)

const baseHeaderStyle: any = {
  header: ({ navigation, options }) => {
    const title = options.title
    return (
      <Header title={title} navigation={navigation} />
    )
  },
}

export const noTitleModalHeaderStyle: any = {
  header: ({ navigation }) => {
    return (
      <NoTitleHeader navigation={navigation} top={10} />
    )
  },
}

export const baseCardHeaderStyle: any = {
  header: ({ navigation, options }) => {
    const title = options.title
    return (
      <Header title={title} navigation={navigation} top={30} />
    )
  },
  presentation: 'card'
}

export const noTitleCardHeaderStyle: any = {
  header: ({ navigation }) => {
    return (
      <NoTitleHeader navigation={navigation} top={40} />
    )
  },
  presentation: 'card'
}

 export const titleOnlyHeaderStyle: any = {
  header: ({ options }) => {
    const title = options.title
    return (
      <TitleOnlyHeader title={title} />
    )
  }
}

const headerStyle: any = {
  ...baseHeaderStyle,
  ...headerOptions,
}

export const cardHeaderStyle: any = {
  ...baseCardHeaderStyle,
  ...headerOptions,
}

export const stackOptions: NativeStackNavigationOptions = {
  ...headerStyle,
  ...contentStyle,
}

export const modalPresentation: NativeStackNavigationOptions = {
  presentation: 'modal',
  gestureEnabled: true,
}

export const tabBarOptions: BottomTabNavigationOptions = {
  tabBarStyle: { padding : 10, height: 100, backgroundColor: Colors.white},
  headerShown: false,
}

export const styles = StyleSheet.create({
  icon: { ...Forms.icon },
  iconLabel: { fontWeight: 'bold' },
  headerText: {
    ...Typography.mediumHeader, color: Colors.pink.darkest, marginTop: 30,
  },
  headerCon: { 
    backgroundColor: Colors.shadow.lightest, height: 100
  },
})