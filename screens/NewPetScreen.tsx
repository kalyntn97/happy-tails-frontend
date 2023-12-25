
//npm modules
import { useState } from "react"
import { View, Text, StyleSheet, Pressable, TextInput} from "react-native"
import { useRoute } from "@react-navigation/native"
//services
import * as petService from '../api/petsService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const NewPetScreen = ({ navigation }) => {
  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<number>(0)
  const [species, setSpecies] = useState<string>('')
  const [breed, setBreed] = useState<string>('')

  const handleSubmit = async (e) => {
    console.log(name, age, species, breed)
    e.preventDefault()
    const newPet = await petService.create({name, age, species, breed})
    console.log('new pet', newPet)
    navigation.navigate('Pets', { newPet: newPet})
  }

  return ( 
    <View style={styles.container}>
      <Text style={styles.header}>Add a Pet</Text>
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder='Pet Name' 
          onChangeText={(text: string) => setName(text)} 
          value={name} 
        />
        <TextInput 
          style={styles.input} 
          placeholder='Age' 
          onChangeText={(text: string) => setAge(Number(text))} 
          value={age} 
        />
        <TextInput 
          style={styles.input} 
          placeholder='Species' 
          onChangeText={(text: string) => setSpecies(text)} 
          value={species} 
        />
        <TextInput 
          style={styles.input} 
          placeholder='Breed' 
          onChangeText={(text: string) => setBreed(text)} 
          value={breed} 
        />
        <Pressable onPress={handleSubmit} style={styles.mainButton}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
  // catAnimation: {
  //   width: '60%',
  // },
  header: {
    ...Typography.mainHeader,
    marginTop: '20%',
    color: Colors.darkPink,
  },
  form: {
    ...Forms.form,
  },
  input: {
    ...Forms.input,
    borderColor: Colors.pink,
  },
  mainButton: {
    ...Buttons.smallRounded,
    marginTop: 50,
    backgroundColor: Colors.pink
  },
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  }
})

export default NewPetScreen