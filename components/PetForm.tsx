//npm modules
import { useState } from "react"
import { View, Text, StyleSheet, Pressable, TextInput, Image, TouchableOpacity} from "react-native"
import * as ImagePicker from 'expo-image-picker'
//types
import { Pet } from "../services/petsService"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface PetFormProps {
  onSubmit: (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => Promise<any>
  initialValues?: { name?: string, age?: number, species?: string, breed?: string, photo?: string | null }
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues }) => {
  const [photo, setPhoto] = useState<string | null>(initialValues?.photo || null)
  const [name, setName] = useState<string>(initialValues?.name || '')
  const [age, setAge] = useState<number>(initialValues?.age || 0)
  const [species, setSpecies] = useState<string>(initialValues?.species || '')
  const [breed, setBreed] = useState<string>(initialValues?.breed || '')

  const addPhoto = async (): Promise<void> => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    })
    console.log(JSON.stringify(_image))

    if (!_image.canceled) {
      setPhoto(_image.assets[0].uri)
    }
  }

  const handleSubmit = async () => {    
    const photoData: { uri: string, name: string, type: string } | null 
      = photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    console.log('before submit', name, age, species, breed, photoData)

    const result = await onSubmit(name, age, species, breed, photoData)
    console.log('result', result)

    if (result && result.error) {
      alert(result.msg)
    }
  }

  return ( 
    <View style={styles.container}>
      <View style={styles.photoUpload}>
        <Image source={{ uri: photo }} style={styles.image} />
        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity onPress={addPhoto} style={styles.uploadBtn}>
            <Text>{photo ? 'Edit' : 'Upload'} Photo</Text>
            <Image source={require('../assets/icons/camera.png')} style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>
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
          keyboardType="numeric"
          placeholder='Age' 
          onChangeText={(text: string) => setAge(Number(text))} 
          value={age.toString()} 
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
          <Text style={styles.buttonText}>{initialValues?.name ? 'Save' : 'Add Pet'}</Text>
        </Pressable>
      </View>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullWH,
    ...Spacing.flexColumn,
  },
  photoUpload: {
    ...Forms.photo,
    position: 'relative',
    overflow: 'hidden',
    margin: 20,
    backgroundColor: Colors.lightPink,
    elevation: 2,
  },
  form: {
    ...Forms.form,
    height: '60%'
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
  },
  image: {
    ...Spacing.fullWH,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.pink,
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    ...Spacing.centered
  },
  cameraIcon: {
    width: 20,
    height: 20,
  }
})

export default PetForm