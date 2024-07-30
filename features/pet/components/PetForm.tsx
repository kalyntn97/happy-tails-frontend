//npm modules
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ImageStyle, ScrollView, Button, Pressable, ImageSourcePropType } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import { CheckboxButton, MainButton, SubButton, TransparentButton } from '@components/ButtonComponent'
import Dropdown from "@components/Dropdown/Dropdown"
import ColorPicker from "@components/ColorPicker"
//helpers & utils
import { SPECIES, SPECIES_OPTIONS, STATUS } from "@pet/petHelpers"
import { getPetIconSource } from "@utils/ui"
//styles
import { Buttons, Spacing, UI, Colors, Typography } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"
import { PetFormData, PhotoFormData } from "@pet/PetInterface"
import { DateInput, ErrorMessage, FormInput, FormLabel, IconPicker, PhotoUpload } from "@components/UIComponents"
import useForm from "@hooks/useForm"
import { useSelectPhoto } from "@hooks/sharedHooks"
import { Header } from "@navigation/NavigationStyles"



interface PetFormProps {
  onSubmit: (formData: PetFormData, photoData: PhotoFormData | null) => Promise<any>
  initialValues?: any
  formStatus: string
  navigation: any
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, initialValues, navigation, formStatus }) => {
  const initialState = { name: initialValues?.name ?? null, species: initialValues?.species ?? null, allowManualSpecies: initialValues ? !SPECIES.includes(initialValues.species) : false, breed: initialValues?.breed ?? null, dob: initialValues?.dob ?? null, showDob: initialValues ? !!initialValues.dob : true, firstMet: initialValues?.firstMet ?? null, showFirstMet: initialValues ? !!initialValues.firstMet : true, altered: initialValues?.altered ?? { value: false, date: null }, showAlteredDate: initialValues ? !!initialValues.altered.date : true, status: initialValues?.status ?? { value: 'Healthy', date: null, show: true }, showPassedDate: initialValues ? !!initialValues.status.date : true, color: initialValues?.color ?? 0, photo: initialValues?.photo ?? null, photoData: null, petId: initialValues?.petId ?? null, errors: {} }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, species, allowManualSpecies, breed, dob, showDob, firstMet, showFirstMet, altered, showAlteredDate, status, showPassedDate, color, photo, petId, errors } = values

  const placeholderPhoto = useMemo(() => {
    let icon: string
    if (species) {
      icon = species === 'Dog' || species === 'Cat' ? `${species}Profile` : 'OtherProfile'
    }
    else icon = 'OtherProfile'
    return getPetIconSource(icon)
  }, [species])

  const handleSelectSpecies = (selected: string) => {
    if (selected === 'Others') {
      onChange('allowManualSpecies', true)
      onChange('species', null)
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

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightAction={() => onValidate({ name, 'type': species })} navigation={navigation} mode='modal' />
    });
  }, [])

  return ( 
    <ScrollView contentContainerStyle={styles.containerWithPadding} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
      <View style={styles.titleCon}>
        <PhotoUpload initial={initialState.photo} placeholder={placeholderPhoto} onSelect={(uri: string) => onChange('photo', uri)} />
        <FormInput initial={name} placeholder="Enter Pet Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} />
      </View>
      
      <FormLabel label='Pet Type' icon='petType' />
      {/* <Dropdown label='Select Type' dataType='species' onSelect={handleSelectSpecies} initial={allowManualSpecies ? 'Others' : species } error={errors?.type} /> */}
      <IconPicker options={SPECIES_OPTIONS} withCustom={true} initial={initialState.species} onSelect={(selected: string) => onChange('species', selected)} />
  
      {allowManualSpecies ?
        <FormInput initial={species} placeholder="Enter Pet Type" onChange={(text: string) => onChange('species', text)} maxLength={50} />
      : species && <>
        <FormLabel label='Pet Breed' icon='pets' />
        <Dropdown withSearch={true} label='Select Breed' dataType={species} onSelect={selected => onChange('breed', selected)} initial={breed} width='60%' />
      </> }
      
      <View style={styles.labelCon}>
        <Text>Date of birth</Text>
        <View style={{ ...Spacing.flexRow}}>
          <Text>Unknown</Text>
          <CheckboxButton onPress={() => { onChange('showDob', !showDob); !showDob && onChange('dob', null) }} initial={!showDob} />
        </View>
      </View>
      {showDob &&
        <DateInput date={dob ?? new Date()} onChangeDate={(selectedDate: Date) => onChange('dob', selectedDate)} />
      }
      <View style={styles.labelCon}>
        <Text>Date you first met</Text>
        <View style={Spacing.flexRow}>
          <Text>Unknown</Text>
          <CheckboxButton onPress={() => { onChange('showFirstMet', !showFirstMet); !showFirstMet && onChange('firstMet', null) }} initial={!showFirstMet} />
        </View>
      </View>
      {showFirstMet && <DateInput date={firstMet ?? new Date()} onChangeDate={(selectedDate: Date) => onChange('firstMet', selectedDate)} /> }

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
          { showAlteredDate && <DateInput date={altered.date ?? new Date()} onChangeDate={(selectedDate: Date) => onChange('altered', { ...altered, date: selectedDate })} /> }
        </>
      }
      <View style={styles.labelCon}>
        <Text>Status?</Text>
        <Dropdown label='' dataType="petStatus" initial={status.value} onSelect={handleSelectStatus} />
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
          {showPassedDate && <DateInput date={status.date ?? new Date()} onChangeDate={(selectedDate: Date) => onChange('status', { ...status, date: selectedDate })} /> }

          <View style={styles.labelCon}>
            <Text>Archive?</Text>
            <CheckboxButton onPress={() => onChange('status', { ...status, show: !status.show })} initial={!status.show} />
          </View>
        </>
      }

      <ColorPicker onPress={selected => onChange('color', selected)} initial={color} />

      <SubButton onPress={onReset} title='Reset' top={10} bottom={10} />

    </ScrollView>

  )
}

export default PetForm