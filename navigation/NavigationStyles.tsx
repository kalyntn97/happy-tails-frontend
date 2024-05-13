import { GoBackButton } from "@components/ButtonComponent"
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Colors, Forms, Typography } from "@styles/index"
import { StyleSheet, Text, View } from "react-native"

const Header = ({ title, navigation }: { title: string, navigation: any }) => (
  <View style={styles.headerCon}>
    <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={10} left={10} />
    <Text style={styles.headerText}>{title}</Text>
  </View>
)

const TitleOnlyHeader = ({ title }: { title: string }) => (
  <View style={styles.headerCon}>
    <Text style={[styles.headerText, { marginTop: 50 }]}>{title}</Text>
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
  }
}

export const noTitleHeaderCardStyle: any = {
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

export const noTitleHeaderModalStyle: any = {
  header: ({ navigation }) => {
    return (
      <NoTitleHeader navigation={navigation} top={10} />
    )
  },
}

const headerStyle: any = {
  ...baseHeaderStyle,
  headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
  headerStyle: { backgroundColor: Colors.shadow.lightest },
  headerTintColor: Colors.black,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.shadow.lightest },
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