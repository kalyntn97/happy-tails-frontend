//npm modules
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ImageStyle, ScrollView } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import { CheckboxButton, MainButton, SubButton } from '@components/ButtonComponent'
import Dropdown from "@components/Dropdown/Dropdown"
import ColorPickingPanel from "@components/ColorPickingPanel"
//helpers & utils
import { SPECIES, STATUS } from "@pet/petHelpers"
import { getPetIconSource } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'
import { styles } from "@styles/FormStyles"

interface PetFormProps {
  onSubmit: (name: string, species: string, breed: string | null, dob: Date | null, firstMet: Date | null, altered: {value: boolean, date: Date | null}, status: {value: string, date: Date | null, show: boolean }, color: number, photoData: { uri: string, name: string, type: string } | null, petId: string | null) => Promise<any>
  initialValues?: { name?: string, species?: string, breed?: string, dob?: Date, firstMet?: Date, altered?: {value: boolean, date: Date }, status?: {value: string, date: Date, show: boolean }, color?: number, photo?: string, petId?: string }
  formStatus: string
  navigation: any
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues, navigation, formStatus }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [species, setSpecies] = useState<string>(initialValues?.species ?? null)
  const [allowManualSpecies, setAllowManualSpecies] = useState<boolean>((initialValues && !SPECIES.includes(initialValues?.species)) ?? false)
  const [breed, setBreed] = useState<string>(initialValues?.breed ?? null)
  const [dob, setDob] = useState<Date>(initialValues?.dob)
  const [showDob, setShowDob] = useState<boolean>(initialValues && !initialValues.dob ? false : true)
  const [firstMet, setFirstMet] = useState<Date>(initialValues?.firstMet ?? null)
  const [showFirstMet, setShowFirstMet] = useState<boolean>(initialValues && !initialValues.firstMet ? false : true)
  const [altered, setAltered] = useState<{ value: boolean, date: Date }>(initialValues?.altered ?? { value: false, date: null })
  const [showAlteredDate, setShowAlteredDate] = useState<boolean>(initialValues && !initialValues.altered?.date ? false : true)
  const [status, setStatus] = useState<{ value: string, date: Date, show: boolean }>(initialValues?.status ?? { value: STATUS[0], date: null, show: true })
  const [showPassedDate, setShowPassedDate] = useState<boolean>(initialValues?.status?.date === null ? false : true)
  const [color, setColor] = useState<number>(initialValues?.color ?? 0)
  const [photo, setPhoto] = useState<string | null>(initialValues?.photo ?? null)
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

  const handleSelectSpecies = (selected: string) => {
    if (selected === 'Others') {
      setAllowManualSpecies(true)
      setSpecies(null)
    } else {
      setAllowManualSpecies(false)
      setSpecies(selected)
    }
  }

  const handleSubmit = async () => {    
    const photoData: { uri: string, name: string, type: string } | null 
      = photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    if (!name || !species) {
      setErrorMsg('Please enter name and type.')
    } else {
      setErrorMsg('')
      if (species === 'Others') setBreed(null)
      await onSubmit(name, species, breed, dob, firstMet, altered, status, color, photoData, petId)
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
      <Text style={{ ...Typography.errorMsg }}>{errorMsg}</Text>
      <Text style={styles.label}>Pet Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Enter pet name'
        placeholderTextColor={Colors.shadow.reg}
        onChangeText={(text: string) => setName(text)} 
        value={name} 
        autoCapitalize="words"
      />

      <Text style={styles.label}>Pet Type</Text>
      {!!breed && species !== 'Others' && 
        <Text>{species === 'Dog' || species === 'Cat' ? 'Select Breed' : 'Select Species'}</Text>
      }
      <View style={styles.rowCon}>
        <Dropdown label={species ? species : 'Select Type'} dataType='species' onSelect={handleSelectSpecies} width={species === 'Others' ? 300 : 130} />
        {species !== 'Others' && <Dropdown label={breed ? breed : 'Select Breed'} dataType={species} onSelect={setBreed} width={165} />}
      </View>
      {allowManualSpecies &&
        <TextInput 
          style={styles.input} 
          placeholder='Enter pet species'
          placeholderTextColor={Colors.shadow.reg}
          onChangeText={(text: string) => setSpecies(text)} 
          value={species} 
          autoCapitalize="words"
      />
      }

        <View style={styles.labelCon}>
          <Text>Date of birth</Text>
          <View style={{ ...Spacing.flexRow}}>
            <Text>Unknown</Text>
            <CheckboxButton onPress={() => { setShowDob(!showDob); setDob(null) }} initial={!showDob} />
          </View>
        </View>
        {showDob && <RNDateTimePicker themeVariant='light' value={new Date(dob ?? new Date())} onChange={(event, selectedDate) => { setDob(selectedDate) }} /> }
        <View style={styles.labelCon}>
          <Text>Date you first met</Text>
          <View style={{ ...Spacing.flexRow }}>
            <Text>Unknown</Text>
            <CheckboxButton onPress={() => { setShowFirstMet(!showFirstMet); setFirstMet(null) }} initial={!showFirstMet} />
          </View>
        </View>
        {showFirstMet && <RNDateTimePicker themeVariant="light" value={new Date(firstMet ?? new Date())} onChange={(event, selectedDate) => { setFirstMet(selectedDate) }} /> }

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
          {showAlteredDate && <RNDateTimePicker themeVariant='light' value={new Date(altered.date ?? new Date())} onChange={(event, selectedDate) => { setAltered({ value: true, date: selectedDate }) }} /> }
        </>
      }
      <View style={styles.labelCon}>
        <Text>Status?</Text>
        <Dropdown label='' dataType="petStatus" initial={STATUS[0]} onSelect={(value) => setStatus(prev => ({...prev, value: value}))} width={140} />
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
          {showPassedDate && <RNDateTimePicker themeVariant="light" value={new Date(status.date ?? new Date())} onChange={(event, selectedDate) => { setStatus(prev => ({...prev, value: STATUS[1], date: selectedDate })) }} /> }
        </>
      }
      <View style={styles.labelCon}>
        <Text>Archive?</Text>
        <CheckboxButton onPress={() => setStatus(prev => ({ ...prev, show: !prev.show }))} initial={!status.show} />
      </View>

      <ColorPickingPanel onPress={setColor} initial={initialValues?.color} />
      <MainButton onPress={handleSubmit} title={formStatus === 'pending' ? 'Submitting' : initialValues?.name ? 'Save' : 'Add Pet'} top={0} bottom={10} />
      <SubButton onPress={ () => {
        navigation.canGoBack() ? navigation.goBack() : navigation.reset({ index: 0, routeName: 'Index'})
      }}
        title='Cancel' top={10} bottom={10} 
      />

    </ScrollView>

  )
}

export default PetForm