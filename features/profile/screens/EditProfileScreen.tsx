//npm modules
import { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle, TextInput, ScrollView } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { useIsFocused } from "@react-navigation/native"
//types & store & queries
import { Profile } from "@profile/ProfileInterface"
import { useSetActions } from "@store/store"
import { useUpdateProfile } from "@profile/profileQueries"
//components
import { MainButton, SubButton } from "@components/ButtonComponent"
import Loader from "@components/Loader"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { AlertForm } from "@utils/ui"
import { ErrorMessage } from "@components/UIComponents"

interface EditProfileProps {
  navigation: any
  route: {params: { profile: Profile }}
}

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation, route }) => {
  const { profile } = route.params
  const updateProfileMutation = useUpdateProfile()

  const isFocused = useIsFocused()

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

  const handleSubmit = async (name: string, bio: string, photo: string) => {
    const photoData = photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    if (!name) {
      setErrorMsg('Please enter name.')
    } else {
      setErrorMsg('')

      updateProfileMutation.mutate({ name, bio, photoData }, {
        onSuccess: () => {
          navigation.navigate('Profile')
          return AlertForm({ body: 'Profile updated successfully', button: 'OK' })
        },
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      }) 
    }
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])
  
  return ( 
    <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false} keyboardShouldPersistTaps='handled'>
      {profile ? 
        <>
          <View style={styles.photoUpload}>
            <Image source={{ uri: photo ?? null }} style={styles.image as ImageStyle} />
            <View style={styles.uploadBtnContainer}>
              <TouchableOpacity onPress={addPhoto} style={styles.uploadBtn}>
                <Text>{photo ? 'Edit' : 'Upload'} Photo</Text>
                <Image source={require('@assets/icons/action-camera.png')} style={styles.cameraIcon } />
              </TouchableOpacity>
            </View>
          </View>

          {errorMsg && <ErrorMessage error={errorMsg} />}

          <View style={styles.form}>
            <TextInput 
              style={styles.input}
              value={name}
              placeholder="Name"
              placeholderTextColor={Colors.shadow.reg}
              onChangeText={(text: string) => setName(text)}
              autoCapitalize="words"
            />
            <TextInput 
              style={[styles.input, styles.multiline]}
              value={bio}
              placeholder="Enter Bio"
              placeholderTextColor={Colors.shadow.reg}
              onChangeText={(text: string) => setBio(text)}
              multiline
            />

            <MainButton title={updateProfileMutation.isPending ? 'Submitting' : 'Save'} onPress={() => handleSubmit(name, bio, photo)} top={40} bottom={0} />
            <SubButton title='Cancel' onPress={() => navigation.goBack()} top={0} bottom={0} />

          </View>
        </>
        : <Loader />
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullCon(),
  },
  photoUpload: {
    ...UI.photo(),
    position: 'relative',
    overflow: 'hidden',
    margin: 20,
    backgroundColor: Colors.pink.light,
    elevation: 2,
  },
  form: {
    ...UI.form,
    height: '60%',
    margin: 10
  },
  input: {
    ...UI.input(),
    borderColor: Colors.pink.reg,
  },
  multiline: {
    height: 150
  },
  mainButton: {
    ...Buttons.smallRounded,
    marginTop: 50,
    backgroundColor: Colors.pink.reg
  },
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.pink.darkest
  },
  image: {
    ...Spacing.fullWH,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.pink.reg,
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