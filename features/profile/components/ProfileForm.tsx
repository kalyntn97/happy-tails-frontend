import React, { useEffect } from 'react'
import { View } from 'react-native'
//components & hooks
import { FormInput, FormLabel, getHeaderActions, PhotoUpload, ScrollScreen } from '@components/UIComponents'
import useForm from '@hooks/useForm'
import { PhotoFormData, ProfileFormData } from '@profile/ProfileInterface'
//styles
import { styles } from '@styles/stylesheets/FormStyles'
import { Header } from '@navigation/NavigationStyles'

type ProfileFormProps = {
  onSubmit: (formData: ProfileFormData, photoData: PhotoFormData | null) => Promise<any>
  initialValues?: ProfileFormData
  isPending: boolean
  navigation: any
}
interface InitialState extends ProfileFormData {
  photoData: { uri: string, name: string, type: 'image/jpeg' } | null
  errors: any
}

const ProfileForm = ({ onSubmit, initialValues, isPending, navigation }: ProfileFormProps) => {
  const initialState: InitialState = {
    name: initialValues.name ?? null,
    bio: initialValues.bio ?? null,
    photo: initialValues.photo ?? null,
    photoData: null,
    errors: {},
  }
  
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, bio, photo, errors }: InitialState = values

  function handleValidate() {
    onValidate({ name })
  }
  
  function handleSubmit() {      
    const photoData = photo && photo !== initialState.photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    onSubmit({ name, bio }, photoData)
  }

  const headerActions = getHeaderActions(onReset, isPending, handleValidate)
  
    useEffect(() => {
      navigation.setOptions({
        header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' />
      })
    }, [headerActions])
    
  return (
    <ScrollScreen>
      <View style={styles.headerCon}>
        <PhotoUpload photo={photo} onSelect={(uri: string) => onChange('photo', uri)} />
        <View style={styles.titleCon}>
          <FormInput initial={initialState.name} placeholder="Your name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} />
        </View>
      </View>

      <FormLabel label="More Info" icon="tag"/>
      <FormInput initial={bio} placeholder="Enter bio" onChange={(text: string) => onChange('bio', text)} maxLength={200} props={{ multiline: true, selectTextOnFocus: true }} error={errors?.bio} styles={{ height: 80 }} width='90%' />
    </ScrollScreen>
  )
}

export default ProfileForm