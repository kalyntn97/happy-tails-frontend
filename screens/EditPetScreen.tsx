//npm modules
import { useState } from "react"
import { View, TextInput, Text, Pressable, StyleSheet, Image } from "react-native"
//components
import UploadImage from "../components/UploadImage"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const EditPetScreen: React.FC = ({ route }) => {
  const { pet } = route.params
  const [name, setName] = useState<string>(pet.name)
  const [age, setAge] = useState<number>(pet.age)
  const [species, setSpecies] = useState<string>(pet.species)
  const [breed, setBreed] = useState<string>(pet.breed)

  const handleSubmit = async () => {
    
  }

  return ( 
    <View style={styles.container}>
      <View style={styles.petPhoto}>
        <UploadImage pet={pet} />
      </View>
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
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
  
  petPhoto: {
    ...Forms.photo
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
 
export default EditPetScreen