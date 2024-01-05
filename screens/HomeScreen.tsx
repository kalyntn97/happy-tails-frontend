//npm modules
import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native"
import LottieView from 'lottie-react-native'
//context
import { useAuth } from "../context/AuthContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const HomeScreen: React.FC = ({ navigation }) => {
  const { authState } = useAuth()

  return ( 
    <>
      {authState?.authenticated ? (
        <View style={styles.container}>
          
        </View>
      ) : (
        <View style={styles.container}>
           <LottieView source={require('../assets/animations/happy.json')} autoPlay loop style={styles.happyAnimation} />
           <View style={styles.headers}>
              <Text style={styles.mainHeader}>Care, Connection, and Joy</Text>
              <Text style={styles.subHeader}>Ready to start a new journey with your furry friends?</Text>
           </View>
          <TouchableOpacity onPress={() => navigation.navigate('User', { screen: 'Login' })} style={styles.mainBtn}>
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text>Register</Text>
          </TouchableOpacity> */}
        </View>
      )}
    </>
    // </HomeStack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullWH,
    ...Spacing.centered,
    backgroundColor: 'white',
  },
  headers:{
    width: '80%',
    marginHorizontal: 20
  },
  mainHeader: {
    fontSize: 35,
    fontWeight: 'bold',
    marginVertical: 10
  },
  subHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'gray',
    marginVertical: 10
  },
  happyAnimation: {
    width: '90%',
  },
  mainBtn: {
    ...Buttons.longSquare,
    backgroundColor: Colors.pink
  },
  btnText: {
    ...Buttons.buttonText,
    fontSize: 17,
    color: Colors.lightestPink
  }
})
 
export default HomeScreen