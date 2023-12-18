import { View, Text, Pressable } from "react-native"

const HomeScreen = ({ navigation }) => {
  return ( 
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text>Sign in here</Text>
      </Pressable>
    </View>
  )
}
 
export default HomeScreen