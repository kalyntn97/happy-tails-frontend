//npm modules
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ImageStyle } from "react-native"
import * as ImagePicker from 'expo-image-picker'
//components
import { MainButton, SubButton } from '@components/ButtonComponent'
import Dropdown from "@components/Dropdown"
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'

interface PetFormProps {
  onSubmit: (name: string, age: number | '', species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string | null) => Promise<any>
  initialValues?: { name?: string, age?: number, species?: string, breed?: string, photo?: string | null, petId?: string }
  navigation: any
  isPending: boolean
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues, navigation, isPending }) => {
  const [photo, setPhoto] = useState<string | null>(initialValues?.photo ?? null)
  const [name, setName] = useState<string>(initialValues?.name ?? '')
  const [age, setAge] = useState<number | ''>(initialValues?.age ?? '')
  const [species, setSpecies] = useState<string>(initialValues?.species ?? '')
  const [breed, setBreed] = useState<string>(initialValues?.breed ?? '')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const petId: string | null = initialValues?.petId ?? null

  
  const addPhoto = async (): Promise<void> => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    })
    if (!_image.canceled) {
      setPhoto(_image.assets[0].uri)
    }
  }

  const handleSubmit = async () => {    
    const photoData: { uri: string, name: string, type: string } | null 
      = photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    if (!name || !species) {
      setErrorMsg('Please enter name and type.')
    } else {
      setErrorMsg('')
      await onSubmit(name, age, species, breed, photoData, petId)
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
              <Image source={require('@assets/icons/camera.png')} style={styles.cameraIcon } />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{ color: Colors.red, fontWeight: 'bold' }}>{errorMsg}</Text>
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
        <Dropdown 
          label={species ? species : 'Select Type'} 
          dataType='species' 
          onSelect={setSpecies} 
        />

        {!!breed && species !== 'Others' && 
          <Text>{species === 'Dog' || species === 'Cat' ? 'Select Breed' : 'Select Species'}</Text>
        }
        {species === 'Dog' && 
          <Dropdown 
            label={breed ? breed : 'Select Breed'} 
            dataType='dogBreed' 
            onSelect={setBreed} 
          />
        }
        {species === 'Cat' && 
          <Dropdown 
            label={breed ? breed : 'Select Breed'} 
            dataType='catBreed' 
            onSelect={setBreed} 
          />
        }
        {species === 'Bird' && 
          <Dropdown 
            label={breed ? breed : 'Select Species'} 
            dataType='birdSpecies' 
            onSelect={setBreed} 
          />
        }
        {species === 'Fish' && 
          <Dropdown 
            label={breed ? breed : 'Select Species'} 
            dataType='fishSpecies' 
            onSelect={setBreed} 
          />
        }
      
        <MainButton onPress={handleSubmit} title={isPending ? 'Submitting' : initialValues?.name ? 'Save' : 'Add Pet'} top={50} bottom={10} />
        <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />

      </View>

    </TouchableWithoutFeedback>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Forms.form,
  },
  photoUpload: {
    ...Forms.photo,
    position: 'relative',
    overflow: 'hidden',
    margin: 20,
    backgroundColor: Colors.lightPink,
    elevation: 2,
  },
  input: {
    ...Forms.input,
    borderColor: Colors.pink,
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