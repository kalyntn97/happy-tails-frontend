//npm modules
import { useState } from "react"
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native"
import * as ImagePicker from 'expo-image-picker'
//types & store
import { Profile } from "@profile/ProfileInterface"
import { useSetActions } from "@store/store"
//components
import { MainButton, SubButton } from "@components/ButtonComponent"
import Loader from "@components/Loader"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface EditProfileProps {
  navigation: any
  route: {params: { profile: Profile }}
}

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation, route }) => {
  const { profile } = route.params
  const { onUpdateProfile } = useSetActions()

  const [name, setName] = useState<string>(profile.name)
  const [bio, setBio] = useState<string>(profile.bio ?? '')
  const [photo, setPhoto] = useState<string | null>(profile.photo ?? null)

  const [errorMsg, setErrorMsg] = useState<string>('')

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
    if (!name) {
      setErrorMsg('Please enter name.')
    } else {
      setErrorMsg('')

      await onUpdateProfile(name, bio, photoData)
      
      navigation.navigate('Profile', { profileId: profile._id })
    }
  }
  

  return ( 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {profile ? 
          <>
            <View style={styles.photoUpload}>
              <Image source={{ uri: photo ?? null }} style={styles.image as ImageStyle} />
              <View style={styles.uploadBtnContainer}>
                <TouchableOpacity onPress={addPhoto} style={styles.uploadBtn}>
                  <Text>{photo ? 'Edit' : 'Upload'} Photo</Text>
                  <Image source={require('@assets/icons/camera.png')} style={styles.cameraIcon } />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={{ color: Colors.red, fontWeight: 'bold' }}>{errorMsg}</Text>

            <View style={styles.form}>
              <TextInput 
                style={styles.input}
                value={name}
                placeholder="Name"
                onChangeText={(text: string) => setName(text)}
                autoCapitalize="words"
              />
              <TextInput 
                style={[styles.input, styles.multiline]}
                value={bio}
                placeholder="Enter Bio"
                onChangeText={(text: string) => setBio(text)}
                multiline
              />

              <MainButton title='Save' onPress={handleSubmit} top={40} bottom={0} />
              <SubButton title='Cancel' onPress={() => navigation.goBack()} top={0} bottom={0} />

            </View>
          </>
          : <Loader />
        }
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
  multiline: {
    height: 150
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

export default EditProfileScreen