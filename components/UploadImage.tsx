//npm modules
import { useEffect, useState } from "react"
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { Pet } from "../api/petsService"
//services
import * as petService from '../api/petsService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface UploadImageProps {
  pet: Pet
}

const UploadImage: React.FC<UploadImageProps> = ({ pet }) => {
  const [image, setImage] = useState<string | null>(null)

  const addImage = async (): Promise<void> => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    })
    console.log(JSON.stringify(_image))

    if (!_image.canceled) {
      setImage(_image.assets[0].uri)
      
      const data = {
        uri: _image.assets[0].uri,
        name: pet._id,
        type: 'image/jpeg'
      }
      await petService.addPhoto(pet._id, data)
    }
  }


  // const checkForCameraRollPermission = async () => {
  //   const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
  //   if (status !== 'granted') {
  //     alert(`Please grant camera roll permissions inside your system's settings`)
  //   } else {
  //     console.log('Media permissions are granted')
  //   }
  // }

  // useEffect(() => {
  //   checkForCameraRollPermission()
  // }, [])

  return ( 
    <View style={styles.container}>
      <Image source={{ uri: pet.photo ? pet.photo : image }} style={styles.image} />
      <View style={styles.uploadBtnContainer}>
        <TouchableOpacity onPress={addImage} style={styles.uploadBtn}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
          <Image source={require('../assets/icons/camera.png')} style={styles.cameraIcon} />
        </TouchableOpacity>
      {/* {image && 
        <>
          <TouchableOpacity onPress={() => setImage(null)}>
            <Text>Remove Image</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Upload Image</Text>
          </TouchableOpacity>
        </>
      } */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    height: '100%',
    width: '100%',
    backgroundColor: Colors.lightPink,
    position: 'relative',
    borderRadius: 100,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.pink,
    width: '100%',
    height: '30%',
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
 
export default UploadImage