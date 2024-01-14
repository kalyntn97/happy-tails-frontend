//npm modules
import { useState } from "react"
import { View, Text, StyleSheet, Pressable, TextInput, Image, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, Alert, ImageStyle} from "react-native"
import * as ImagePicker from 'expo-image-picker'
//types & services & utils
import { Pet } from "../services/petService"
import * as petService from '../services/petService'
import * as petUtils from '../utils/petUtils'
//components
import Dropdown from "./Dropdown"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface PetFormProps {
  onSubmit: (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string | null) => Promise<any>
  initialValues?: { name?: string, age?: number, species?: string, breed?: string, photo?: string | null, petId?: string }
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues }) => {
  const [photo, setPhoto] = useState<string | null>(initialValues?.photo || null)
  const [name, setName] = useState<string>(initialValues?.name || '')
  const [age, setAge] = useState<number | ''>(initialValues?.age || '')
  const [species, setSpecies] = useState<string>(initialValues?.species || '')
  const [breed, setBreed] = useState<string>(initialValues?.breed || '')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const petId: string | null = initialValues?.petId  ? initialValues?.petId : null

  
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
    console.log('before submit', name, age, species, breed, photoData, petId)
    if (!name || !species) {
      setErrorMsg('Please enter name and type.')
    } else {
      setErrorMsg('')
      const result = await onSubmit(name, age, species, breed, photoData, petId)
      console.log('result', result)
  
      if (result && result.error) {
        alert(result.msg)
      }
    }
  }

  return ( 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={styles.container}>
        <View style={styles.photoUpload}>
          <Image source={{ uri: photo }} style={styles.image as ImageStyle} />
          <View style={styles.uploadBtnContainer}>
            <TouchableOpacity onPress={addPhoto} style={styles.uploadBtn}>
              <Text>{photo ? 'Edit' : 'Upload'} Photo</Text>
              <Image source={require('../assets/icons/camera.png')} style={styles.cameraIcon as ImageStyle} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{ color: Colors.red, fontWeight: 'bold' }}>{errorMsg}</Text>
        <View style={styles.form}>
          <TextInput 
            style={styles.input} 
            placeholder='Pet Name' 
            onChangeText={(text: string) => setName(text)} 
            value={name} 
            autoCapitalize="words"
          />
          <TextInput 
            style={styles.input} 
            placeholder='Age' 
            onChangeText={(text: string) => setAge(text !== '' ? Number(text) : '')} 
            value={age !== '' ? age.toString() : ''} 
            keyboardType="numeric"
          />
          {!!species && <Text>Select Type</Text>}
          <Dropdown label={species ? species : 'Select Type'} dataType='species' onSelect={setSpecies} />

          {!!breed && <Text>{species === 'Dog' || species === 'Cat' ? 'Select Breed' : 'Select Species'}</Text>}
          {species === 'Dog' && <Dropdown label={breed ? breed : 'Select Breed'} dataType='dogBreed' onSelect={setBreed} />}
          
          {species === 'Cat' && <Dropdown label={breed ? breed : 'Select Breed'} dataType='catBreed' onSelect={setBreed} />}
          
          {species === 'Bird' && <Dropdown label={breed ? breed : 'Select Species'} dataType='birdSpecies' onSelect={setBreed} />}
          
          {species === 'Fish' && <Dropdown label={breed ? breed : 'Select Species'} dataType='fishSpecies' onSelect={setBreed} />}

          <TouchableOpacity onPress={handleSubmit} style={styles.mainButton}>
            <Text style={styles.buttonText}>{initialValues?.name ? 'Save' : 'Add Pet'}</Text>
          </TouchableOpacity>
        </View>
      </View>

    </TouchableWithoutFeedback>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
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
    height: '60%',
    margin: 10
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