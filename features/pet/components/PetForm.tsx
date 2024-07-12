//npm modules
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ImageStyle, ScrollView } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import { CheckboxButton, MainButton, SubButton, TransparentButton } from '@components/ButtonComponent'
import Dropdown from "@components/Dropdown/Dropdown"
import ColorPicker from "@components/ColorPicker"
//helpers & utils
import { SPECIES, STATUS } from "@pet/petHelpers"
import { getPetIconSource } from "@utils/ui"
//styles
import { Buttons, Spacing, UI, Colors, Typography } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"
import { PetFormData, PhotoFormData } from "@pet/PetInterface"
import { ErrorMessage } from "@components/UIComponents"
import useForm from "@hooks/useForm"
import { useSelectPhoto } from "@hooks/sharedHooks"



interface PetFormProps {
  onSubmit: (formData: PetFormData, photoData: PhotoFormData | null) => Promise<any>
  initialValues?: any
  formStatus: string
  navigation: any
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues, navigation, formStatus }) => {
  const initialState = { name: initialValues?.name ?? null, species: initialValues?.species ?? null, allowManualSpecies: initialValues ? !SPECIES.includes(initialValues.species) : false, breed: initialValues?.breed ?? null, dob: initialValues?.dob ?? null, showDob: initialValues ? !!initialValues.dob : true, firstMet: initialValues?.firstMet ?? null, showFirstMet: initialValues ? !!initialValues.firstMet : true, altered: initialValues?.altered ?? { value: false, date: null }, showAlteredDate: initialValues ? !!initialValues.altered.date : true, status: initialValues?.status ?? { value: 'Healthy', date: null, show: true }, showPassedDate: initialValues ? !!initialValues.status.date : true, color: initialValues?.color ?? 0, photo: initialValues?.photo ?? null, photoData: null, petId: initialValues?.petId ?? null, errorMsg: '' }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, species, allowManualSpecies, breed, dob, showDob, firstMet, showFirstMet, altered, showAlteredDate, status, showPassedDate, color, photo, petId, errorMsg } = values

  const addPhoto = async (): Promise<void> => {
    const photo = await useSelectPhoto()
    onChange('photo', photo)
  }

  const handleSelectSpecies = (selected: string) => {
    if (selected === 'Others') {
      onChange('allowManualSpecies', true)
      onChange('breed', null)
    } else {
      onChange('allowManualSpecies', false)
      onChange('species', selected)
    }
  }

  const handleSelectStatus = (selected: string) => {
    selected === 'Healthy'
      ? onChange('status', { ...status, value: selected, date: null, show: true })
      : onChange('status', { ...status, value: selected, date: new Date() })
  }

  function handleSubmit() {
    const photoData = photo && photo !== initialState.photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    onSubmit({ name, species, breed, dob, firstMet, altered, status, color, petId }, photoData)
  }
  
  return ( 
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
      <View style={styles.photoUpload}>
        <Image source={photo ? { uri: photo } : species ? getPetIconSource(`${species}Profile`) : require('assets/icons/ui-image.png')} style={styles.image as ImageStyle} />
        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity onPress={addPhoto} style={styles.uploadBtn}>
            <Text>{photo ? 'Edit' : 'Upload'} Photo</Text>
            <Image source={require('@assets/icons/action-camera.png')} style={styles.cameraIcon } />
          </TouchableOpacity>
        </View>
      </View>
      {errorMsg && <ErrorMessage error={errorMsg} />}
      <Text style={styles.label}>Pet Name (required)</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Enter pet name'
        placeholderTextColor={Colors.shadow.reg}
        onChangeText={(text: string) => onChange('name', text)} 
        value={name} 
        autoCapitalize="words"
      />
      <View style={styles.labelCon}>
        <Text>Pet Type (required)</Text>
        {!allowManualSpecies && 
          <Text>{species === 'Dog' || species === 'Cat' ? 'Select Breed' : 'Select Species'}</Text>
        }
      </View>
      <View style={styles.rowCon}>
        <Dropdown label='Select Type' dataType='species' onSelect={handleSelectSpecies} initial={allowManualSpecies ? 'Others' : species} width={125} />
        {allowManualSpecies ?
          <TextInput 
            style={[styles.input, { width: 170 }]} 
            placeholder='Enter pet type'
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => onChange('species', text)} 
            value={species} 
            autoCapitalize="words"
          /> : <Dropdown label='Select Breed' dataType={species} onSelect={selected => onChange('breed', selected)} initial={breed} width={170} />
        }
      </View>

        <View style={styles.labelCon}>
          <Text>Date of birth</Text>
          <View style={{ ...Spacing.flexRow}}>
            <Text>Unknown</Text>
            <CheckboxButton onPress={() => { onChange('showDob', !showDob); !showDob && onChange('dob', null) }} initial={!showDob} />
          </View>
        </View>
        {showDob && <RNDateTimePicker themeVariant='light' value={dob ? new Date(dob) : new Date()} onChange={(event, selectedDate) => onChange('dob', selectedDate) } /> }
        <View style={styles.labelCon}>
          <Text>Date you first met</Text>
          <View style={Spacing.flexRow}>
            <Text>Unknown</Text>
            <CheckboxButton onPress={() => { onChange('showFirstMet', !showFirstMet); !showFirstMet && onChange('firstMet', null) }} initial={!showFirstMet} />
          </View>
        </View>
        {showFirstMet && <RNDateTimePicker themeVariant="light" value={firstMet ? new Date(firstMet) : new Date()} onChange={(event, selectedDate) => onChange('firstMet', selectedDate)} /> }

      <View style={styles.labelCon}>
        <Text>Neutered/ Spayed?</Text>
        <CheckboxButton onPress={() => { onChange('altered', { ...altered, value: !altered.value }) }} initial={altered.value} />
      </View>

      {altered.value && 
        <>
          <View style={styles.labelCon}>
            <Text>Surgery Date</Text>
              <View style={Spacing.flexRow}>
                <Text>Unknown</Text>
                <CheckboxButton onPress={() => { onChange('showAlteredDate', !showAlteredDate); !showAlteredDate && onChange('altered', { ...altered, date: null }) }} initial={!showAlteredDate} />
              </View>
          </View>
          {showAlteredDate && <RNDateTimePicker themeVariant='light' value={altered.date ? new Date(altered.date) : new Date()} onChange={(event, selectedDate) => onChange('altered', { ...altered, date: selectedDate }) } />}
        </>
      }
      <View style={styles.labelCon}>
        <Text>Status?</Text>
        <Dropdown label='' dataType="petStatus" initial={status.value} onSelect={handleSelectStatus} width={140} />
      </View>

      {status.value === 'Passed away' && 
        <>
          <View style={styles.labelCon}>
            <Text>Date</Text>
              <View style={Spacing.flexRow}>
                <Text>Unknown</Text>
                <CheckboxButton onPress={() => { onChange('showPassedDate', !showPassedDate); !showPassedDate && onChange('status', {...status, date: null }) }} initial={!showPassedDate} />
              </View>
          </View>
          {showPassedDate && <RNDateTimePicker themeVariant="light" value={status.date ? new Date(status.date) : new Date()} onChange={(event, selectedDate) => { onChange('status', {...status, date: selectedDate }) }} /> }

          <View style={styles.labelCon}>
            <Text>Archive?</Text>
            <CheckboxButton onPress={() => onChange('status', { ...status, show: !status.show })} initial={!status.show} />
          </View>
        </>
      }

      <ColorPicker onPress={selected => onChange('color', selected)} initial={color} />

      <View style={{ ...Spacing.flexRow}}>
        <MainButton onPress={() => onValidate(name, species)} title={formStatus === 'pending' ? 'Submitting' : !!name ? 'Save' : 'Create'} top={0} bottom={10} />
        <TransparentButton onPress={onReset} title='Clear' />
      </View>

    </ScrollView>

  )
}

export default PetForm