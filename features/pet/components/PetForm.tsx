//npm modules
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ImageStyle, ScrollView } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import { CheckboxButton, MainButton, SubButton } from '@components/ButtonComponent'
import Dropdown from "@components/Dropdown/Dropdown"
import ColorPickingPanel from "@components/ColorPickingPanel"

//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'
import { STATUS } from "@pet/petHelpers"
import { getPetIconSource } from "@utils/ui"

interface PetFormProps {
  onSubmit: (name: string, species: string, breed: string | null, dob: Date | null, firstMet: Date | null, altered: {value: boolean, date: Date | null}, status: {value: string, date: Date | null, show: boolean }, color: number, photoData: { uri: string, name: string, type: string } | null, petId: string | null) => Promise<any>
  initialValues?: { name?: string, species?: string, breed?: string, dob?: Date, firstMet?: Date, altered?: {value: boolean, date: Date }, status?: {value: string, date: Date, show: boolean }, color?: number, photo?: string, petId?: string }
  formStatus: string
  navigation: any
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues, navigation, formStatus }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [species, setSpecies] = useState<string>(initialValues?.species ?? null)
  const [breed, setBreed] = useState<string>(initialValues?.breed ?? null)
  const [dob, setDob] = useState<Date>(initialValues?.dob)
  const [showDob, setShowDob] = useState<boolean>(initialValues?.dob ? true : false)
  const [firstMet, setFirstMet] = useState<Date>(initialValues?.firstMet ?? null)
  const [showFirstMet, setShowFirstMet] = useState<boolean>(initialValues?.firstMet ? true : false)
  const [altered, setAltered] = useState<{ value: boolean, date: Date }>(initialValues?.altered ?? { value: false, date: null })
  const [showAlteredDate, setShowAlteredDate] = useState<boolean>(initialValues?.altered?.date === null ? false : true)
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
      <Text style={{ color: Colors.red.dark, fontWeight: 'bold' }}>{errorMsg}</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Pet Name' 
        onChangeText={(text: string) => setName(text)} 
        value={name} 
        autoCapitalize="words"
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
      <View style={{ ...Spacing.flexColumn, marginTop: 20 }}>
        <View style={styles.dateCon}>
          <Text>Date of birth</Text>
          <View style={styles.rowCon}>
            <CheckboxButton onPress={() => { setShowDob(!showDob); setDob(null) }} initial={!showDob} />
            <Text>Unknown</Text>
          </View>
        </View>
        {showDob && <RNDateTimePicker value={new Date(dob ?? new Date())} onChange={(event, selectedDate) => { setDob(selectedDate) }} /> }
        <View style={styles.dateCon}>
          <Text>Date you first met</Text>
          <View style={styles.rowCon}>
            <CheckboxButton onPress={() => { setShowFirstMet(!showFirstMet); setFirstMet(null) }} initial={!showFirstMet} />
            <Text>Unknown</Text>
          </View>
        </View>
        {showFirstMet && <RNDateTimePicker value={new Date(firstMet ?? new Date())} onChange={(event, selectedDate) => { setFirstMet(selectedDate) }} /> }
      </View>

      <View style={styles.dateCon}>
        <Text>Neutered/ Spayed?</Text>
        <CheckboxButton onPress={() => { setAltered(prev => ({ ...prev, value: !prev.value })) }} initial={altered.value} />
      </View>

      {altered.value && 
        <>
          <View style={styles.dateCon}>
            <Text>Surgery Date</Text>
              <View style={styles.rowCon}>
                <CheckboxButton onPress={() => { setShowAlteredDate(!showAlteredDate); setAltered(prev => ({...prev, date: null })) }} initial={!showAlteredDate} />
                <Text>Unknown</Text>
              </View>
          </View>
          {showAlteredDate && <RNDateTimePicker value={new Date(altered.date ?? new Date())} onChange={(event, selectedDate) => { setAltered({ value: true, date: selectedDate }) }} /> }
        </>
      }
      <View style={styles.dateCon}>
        <Text>Status?</Text>
        <Dropdown label='' dataType="petStatus" initial={STATUS[0]} onSelect={(value) => setStatus(prev => ({...prev, value: value}))} width={140} />
      </View>

      {status.value === STATUS[1] && 
        <>
          <View style={styles.dateCon}>
            <Text>Date</Text>
              <View style={styles.rowCon}>
                <CheckboxButton onPress={() => { setShowPassedDate(!showPassedDate); setStatus(prev => ({...prev, date: null })) }} initial={!!status.date} />
                <Text>Unknown</Text>
              </View>
          </View>
          {showPassedDate && <RNDateTimePicker value={new Date(status.date ?? new Date())} onChange={(event, selectedDate) => { setStatus(prev => ({...prev, value: STATUS[1], date: selectedDate })) }} /> }
        </>
      }
      <View style={styles.dateCon}>
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
 
const styles = StyleSheet.create({
  container: {
    ...Forms.form,
  },
  photoUpload: {
    ...Forms.photo,
    position: 'relative',
    overflow: 'hidden',
    margin: 20,
    backgroundColor: Colors.pink.light,
    elevation: 2,
  },
  input: {
    ...Forms.input,
    borderColor: Colors.pink.reg,
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
  },
  dateCon: {
    ...Spacing.flexRow,
    justifyContent: "space-between",
    width: 270,
    marginVertical: 20,
  },
  rowCon: {
    ...Spacing.flexRow,
    marginHorizontal: 10,
  },
})

export default PetForm