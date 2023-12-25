//npm modules
import { useState } from "react"
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native"
import * as ImagePicker from 'expo-image-picker'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const UploadImage: React.FC = () => {
  const [image, setImage] = useState<string>(null)
  const addImage = async (): Promise<any> => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    })
    console.log(JSON.stringify(_image))
    if (!_image.canceled) {
      setImage(_image.assets[0].uri)
    }
  }
  return ( 
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.uploadBtnContainer}>
        <TouchableOpacity onPress={addImage} style={styles.uploadBtn}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
          <Image source={require('../assets/icons/camera.png')} style={styles.cameraIcon} />
        </TouchableOpacity>
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