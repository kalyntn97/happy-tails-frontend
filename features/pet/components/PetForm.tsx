//npm modules
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ImageStyle, ScrollView } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import { CheckboxButton, MainButton, SubButton, TransparentButton } from '@components/ButtonComponent'
import Dropdown from "@components/Dropdown/Dropdown"
import ColorPickingPanel from "@components/ColorPickingPanel"
//helpers & utils
import { SPECIES, STATUS } from "@pet/petHelpers"
import { getPetIconSource } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'
import { styles } from "@styles/FormStyles"
import { InitialPet, InitialPetValues, PhotoFormData } from "@pet/PetInterface"
import { ErrorMessage } from "@components/UIComponents"



interface PetFormProps {
  onSubmit: ({ name, species, breed, dob, firstMet, altered, status, color }: InitialPet, photoData: PhotoFormData, petId: string | null) => Promise<any>
  initialValues?: InitialPetValues
  formStatus: string
  navigation: any
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues, navigation, formStatus }) => {
  const initialStates = { name: initialValues?.name ?? null, species: initialValues?.species ?? null, allowManualSpecies: initialValues ? !SPECIES.includes(initialValues.species) : false, breed: initialValues?.breed ?? null, dob: initialValues?.dob ?? null, showDob: initialValues ? !!initialValues.dob : true, firstMet: initialValues?.firstMet ?? null, showFirstMet: initialValues ? !!initialValues.firstMet : true, altered: initialValues?.altered ?? { value: false, date: null }, showAlteredDate: initialValues ? !!initialValues.altered.date : true, status: initialValues?.status ?? { value: STATUS[0], date: null, show: true }, showPassedDate: initialValues ? !!initialValues.status.date : true, color: initialValues?.color ?? 0, photo: initialValues?.photo ?? null, errorMsg: '' }

  const [name, setName] = useState<string>(initialStates.name)
  const [species, setSpecies] = useState<string>(initialStates.species)
  const [allowManualSpecies, setAllowManualSpecies] = useState<boolean>(initialStates.allowManualSpecies)
  const [breed, setBreed] = useState<string>(initialStates.breed)
  const [dob, setDob] = useState<string>(initialStates.dob)
  const [showDob, setShowDob] = useState<boolean>(initialStates.showDob)
  const [firstMet, setFirstMet] = useState<string>(initialStates.firstMet)
  const [showFirstMet, setShowFirstMet] = useState<boolean>(initialStates.showFirstMet)
  const [altered, setAltered] = useState<{ value: boolean, date: string }>(initialStates.altered)
  const [showAlteredDate, setShowAlteredDate] = useState<boolean>(initialStates.showAlteredDate)
  const [status, setStatus] = useState<{ value: string, date: string, show: boolean }>(initialStates.status)
  const [showPassedDate, setShowPassedDate] = useState<boolean>(initialStates.showPassedDate)
  const [color, setColor] = useState<number>(initialStates.color)
  const [photo, setPhoto] = useState<string | null>(initialStates.photo)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [reset, setReset] = useState<boolean>(false)

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

  const handleSelectSpecies = (selected: string) => {
    if (selected === 'Others') {
      setAllowManualSpecies(true)
      setSpecies(null)
    } else {
      setAllowManualSpecies(false)
      setSpecies(selected)
    }
  }

  const handleSelectStatus = (selected: string) => {
    selected === STATUS[0] 
      ? setStatus(prev => ({ ...prev, value: selected, date: null, show: true }))
      : setStatus(prev => ({ ...prev, value: selected, show: selected !== STATUS[1] }))
  }

  const handleSubmit = async () => {    
    const photoData: { uri: string, name: string, type: string } | null 
      = photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    if (!name || !species) {
      setErrorMsg('Please enter name and type.')
    } else {
      setErrorMsg('')
      if (species === 'Others') setBreed(null)
      await onSubmit({ name, species, breed, dob, firstMet, altered, status, color }, photoData, petId)
    }
  }

  return ( 
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
      <View style={styles.photoUpload}>
        <Image source={photo ? { uri: photo } : species && getPetIconSource(`${species}Profile`)} style={styles.image as ImageStyle} />
        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity onPress={addPhoto} style={styles.uploadBtn}>
            <Text>{photo ? 'Edit' : 'Upload'} Photo</Text>
            <Image source={require('@assets/icons/action-camera.png')} style={styles.cameraIcon } />
          </TouchableOpacity>
        </View>
      </View>
      {errorMsg && <ErrorMessage error={errorMsg} />}
      <Text style={styles.label}>Pet Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Enter pet name'
        placeholderTextColor={Colors.shadow.reg}
        onChangeText={(text: string) => setName(text)} 
        value={name} 
        autoCapitalize="words"
      />
      <View style={styles.labelCon}>
        <Text>Pet Type</Text>
        {!allowManualSpecies && 
          <Text>{species === 'Dog' || species === 'Cat' ? 'Select Breed' : 'Select Species'}</Text>
        }
      </View>
      <View style={styles.rowCon}>
        <Dropdown label='Select Type' dataType='species' onSelect={handleSelectSpecies} initial={species} width={125} />
        {allowManualSpecies ?
          <TextInput 
            style={[styles.input, { width: 170 }]} 
            placeholder='Enter pet type'
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => setSpecies(text)} 
            value={species} 
            autoCapitalize="words"
          /> : <Dropdown label='Select Breed' dataType={species} onSelect={setBreed} initial={breed} width={170} />
        }
      </View>

        <View style={styles.labelCon}>
          <Text>Date of birth</Text>
          <View style={{ ...Spacing.flexRow}}>
            <Text>Unknown</Text>
            <CheckboxButton onPress={() => { setShowDob(!showDob); setDob(null) }} initial={!showDob} />
          </View>
        </View>
        {showDob && <RNDateTimePicker themeVariant='light' value={new Date(dob ?? new Date())} onChange={(event, selectedDate) => { setDob(selectedDate.toISOString()) }} /> }
        <View style={styles.labelCon}>
          <Text>Date you first met</Text>
          <View style={{ ...Spacing.flexRow }}>
            <Text>Unknown</Text>
            <CheckboxButton onPress={() => { setShowFirstMet(!showFirstMet); setFirstMet(null) }} initial={!showFirstMet} />
          </View>
        </View>
        {showFirstMet && <RNDateTimePicker themeVariant="light" value={new Date(firstMet ?? new Date())} onChange={(event, selectedDate) => { setFirstMet(selectedDate.toISOString()) }} /> }

      <View style={styles.labelCon}>
        <Text>Neutered/ Spayed?</Text>
        <CheckboxButton onPress={() => { setAltered(prev => ({ ...prev, value: !prev.value })) }} initial={altered.value} />
      </View>

      {altered.value && 
        <>
          <View style={styles.labelCon}>
            <Text>Surgery Date</Text>
              <View style={{ ...Spacing.flexRow }}>
                <Text>Unknown</Text>
                <CheckboxButton onPress={() => { setShowAlteredDate(!showAlteredDate); setAltered(prev => ({...prev, date: null })) }} initial={!showAlteredDate} />
              </View>
          </View>
          {showAlteredDate && <RNDateTimePicker themeVariant='light' value={new Date(altered.date ?? new Date())} onChange={(event, selectedDate) => { setAltered({ value: true, date: selectedDate.toISOString() }) }} /> }
        </>
      }
      <View style={styles.labelCon}>
        <Text>Status?</Text>
        <Dropdown label='' dataType="petStatus" initial={STATUS[0]} onSelect={handleSelectStatus} width={140} />
      </View>

      {status.value === STATUS[1] && 
        <>
          <View style={styles.labelCon}>
            <Text>Date</Text>
              <View style={{ ...Spacing.flexRow }}>
                <Text>Unknown</Text>
                <CheckboxButton onPress={() => { setShowPassedDate(!showPassedDate); setStatus(prev => ({...prev, date: null })) }} initial={!!status.date} />
              </View>
          </View>
          {showPassedDate && <RNDateTimePicker themeVariant="light" value={new Date(status.date ?? new Date())} onChange={(event, selectedDate) => { setStatus(prev => ({...prev, value: STATUS[1], date: selectedDate.toISOString() })) }} /> }

          <View style={styles.labelCon}>
            <Text>Archive?</Text>
            <CheckboxButton onPress={() => setStatus(prev => ({ ...prev, show: !prev.show }))} initial={!status.show} />
          </View>
        </>
      }

      <ColorPickingPanel onPress={setColor} initial={initialValues?.color} />

      <View style={{ ...Spacing.flexRow}}>
        <MainButton onPress={handleSubmit} title={formStatus === 'pending' ? 'Submitting' : initialValues?.name ? 'Save' : 'Add Pet'} top={0} bottom={10} />
        <TransparentButton onPress={() => setReset(true)} title='Clear' />
      </View>

    </ScrollView>

  )
}

export default PetForm