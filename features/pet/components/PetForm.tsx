//npm modules
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ImageStyle, ScrollView, Button, Pressable, ImageSourcePropType, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native"
//components
import { CheckboxButton, MainButton, SubButton, ToggleButton, TransparentButton } from '@components/ButtonComponents'
import { DateInput, ErrorMessage, FormInput, FormLabel, Icon, ModalInput, PhotoUpload, TableForm } from "@components/UIComponents"
import Dropdown from "@components/Dropdown/Dropdown"
import IconPicker from "@components/Pickers/IconPicker"
import ColorPicker from "@components/Pickers/ColorPicker"
import { Header } from "@navigation/NavigationStyles"
//helpers & utils
import useForm from "@hooks/useForm"
import { getActionIconSource, getPetIconSource } from "@utils/ui"
import { Pet, PetFormData, PhotoFormData } from "@pet/PetInterface"
import { GENDER, SPECIES, SPECIES_OPTIONS, STATUS } from "@pet/petHelpers"
//styles
import { Buttons, Spacing, UI, Colors, Typography } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"

interface PetFormProps {
  onSubmit: (formData: PetFormData, photoData: PhotoFormData | null) => Promise<any>
  initialValues?: Pet
  formStatus: string
  navigation: any
  setColor: (color: number) => void
}

const PetForm = ({ onSubmit, initialValues, navigation, formStatus, setColor }: PetFormProps) => {
  const initialState = useMemo(() => ({ name: initialValues?.name ?? null, gender: initialValues?.gender ?? GENDER[0], species: initialValues?.species ?? SPECIES_OPTIONS[0].title, allowManualSpecies: initialValues ? !SPECIES.includes(initialValues.species) : false, breed: initialValues?.breed ?? null, dob: initialValues?.dob ?? null, firstMet: initialValues?.firstMet ?? null, altered: initialValues?.altered ?? { value: false, date: null }, status: initialValues?.status ?? { value: 'Healthy', date: null, archive: false }, color: initialValues?.color ?? 0, photo: initialValues?.photo ?? null, photoData: null, petId: initialValues?.petId ?? null, errors: {} }), [initialValues])

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, gender, species, breed, dob, firstMet, altered, status, color, photo, petId, errors } = values

  const placeholderPhoto = useMemo(() => {
    let icon: string
    if (species) {
      icon = species === 'Dog' || species === 'Cat' ? `${species}Profile` : 'OtherProfile'
    }
    else icon = 'OtherProfile'
    return getPetIconSource(icon)
  }, [species])

  const handleSelectStatus = (selected: string) => {
    selected === 'Healthy'
      ? onChange('status', { ...status, value: selected, date: null, show: true })
      : onChange('status', { ...status, value: selected, date: new Date() })
  }

  function handleSubmit() {
    const photoData = photo && photo !== initialState.photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    onSubmit({ name, gender, species, breed, dob, firstMet, altered, status, color, petId }, photoData)
  }

  const renderType = (
    <ModalInput height='90%' customLabel={
      <View style={Spacing.flexRow}>
        <Icon iconSource={getPetIconSource(species)} size='xSmall' styles={{ marginRight: 10 }}/>
        { ['Dog', 'Cat', 'Bird', 'Fish'].includes(species) ?
          <Text>{breed ?? 'Unknown breed'}</Text> 
          : <Text>{species}</Text>
        }
      </View>
    }>
      <View style={Spacing.flexColumn}>
        <FormLabel label='Pet Type' icon='petType' />
        <IconPicker selected={species} options={SPECIES_OPTIONS} withCustom={true} initial={initialState.species} onSelect={(selected: string) => {
          onChange('species', selected)
          onChange('breed', null)
        }} customIcon={{ type: 'pet', name: 'Others' }} />

        { ['Dog', 'Cat', 'Bird', 'Fish'].includes(species) && <>
          <FormLabel label='Pet Breed' icon='pets' />
          <Dropdown withSearch={true} label='Search Breed' dataType={species} onSelect={selected => onChange('breed', selected)} initial={breed} width='80%' contentPosition="top" />
        </> }
      </View>
    </ModalInput>
  )

  const renderDob = (
    <DateInput date={dob} placeholder='Unknown' onChangeDate={(selected) => onChange('dob', selected)} color={color} />
  )

  const renderFirstMet = (
    <DateInput date={firstMet} placeholder='Unknown' onChangeDate={(selected) => onChange('firstMet', selected)} color={color} />
  )

  const renderGender = (
    <View style={Spacing.flexRow}>
      { GENDER.map(option => 
        <TouchableOpacity key={option} onPress={() => onChange('gender', option)} style={{ marginLeft: 20, opacity: gender === option ? 1 : 0.3 }}>
          <Text>{option}</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderAlteredValue = (
    <ToggleButton isChecked={altered.value} onPress={() => onChange('altered', { value: !altered.value, date: null })} />
  )
  const renderAlteredDate = (
    <DateInput date={altered.date} placeholder='Unknown date' onChangeDate={(selected) => onChange('altered', { ...altered, date: selected })} color={color} />
  )

  const alteredTable = [
    { key: 'alteredValue', label: 'Altered', icon: 'altered', value: renderAlteredValue },
    { key: 'alteredDate', label: 'Surgery Date', icon: 'date', value: renderAlteredDate },
  ]

  const renderAltered = (
    <ModalInput label={altered.value ? 
      `${gender === 'Boy' ? 'Neutered' : gender === 'Girl' ? 'Spayed' : 'Altered'} on ${altered.date ? altered.date.toLocaleDateString() : 'unknown date'}`
      : `Not ${gender === 'Boy' ? 'Neutered' : gender === 'Girl' ? 'Spayed' : 'Altered'}`
    }>
      <TableForm table={alteredTable} withLabel={true} />
    </ModalInput>
  )

  const renderStatusValue = (
    <Dropdown label='Status' dataType="petStatus" initial={status.value} onSelect={handleSelectStatus} buttonStyles={{ paddingLeft: 20 }}/>
  )
  const renderStatusDate = (
    <DateInput date={status.date} placeholder='Unknown date' onChangeDate={(selected) => onChange('status', { ...altered, date: selected })} color={color} />
  )
  const renderStatusArchive = (
    <ToggleButton isChecked={status.archive} onPress={() => onChange('status', { ...status, archive: !status.archive })} />
  )

  const statusTable = [
    { key: 'statusValue', icon: 'status', value: renderStatusValue },
    { key: 'statusDate', icon: 'schedule', value: renderStatusDate },
    { key: 'statusArchive', icon: 'archive', value: renderStatusArchive },
  ]

  const renderStatus = (
    <ModalInput customLabel={
      <View style={Spacing.flexRow}>
        <Text style={{ marginRight: 10 }}>{status.value}</Text>
        <Icon iconSource={getActionIconSource(status.archive ? 'hide' : 'show')} size="xSmall" />
      </View>
    }>
      <TableForm table={statusTable} dependentRows={{ statusDate: status.value === STATUS[1] }} />
    </ModalInput>
  )
    
  const mainTable = [
    { key: 'type', label: 'Type', icon: 'pets', value: renderType },
    { key: 'dob', label: 'Date of Birth', icon: 'birthday', value: renderDob },
    { key: 'adopt', label: 'Adoption Date', icon: 'adopt', value: renderFirstMet }, 
    { key: 'gender', label: 'Gender', icon: 'gender', value: renderGender },
    { key: 'altered', label: 'Altered', icon: 'altered', value: renderAltered },
    { key: 'status', label: 'Status', icon: 'status', value: renderStatus },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightAction={() => onValidate({ name, 'type': species })} navigation={navigation} mode='modal' bgColor={Colors.multi.lightest[color]} />
    })
  }, [color])

  return ( 
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      <View style={styles.headerCon}>
        <PhotoUpload photo={photo} placeholder={placeholderPhoto} onSelect={(uri: string) => onChange('photo', uri)} />
        <View style={[styles.titleCon, { width: '65%' }]}>
          <FormInput initial={initialState.name} placeholder="New Pet Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} />
        </View>
      </View>
      
      <TableForm table={mainTable} withLabel={true} />

      <ColorPicker selected={color} buttonWidth={30} pickerStyles={{ marginTop: 10 }} onPress={selected => {
        onChange('color', selected)
        setColor(selected)
      }} />

      <SubButton onPress={onReset} title='Reset' top={40} bottom={10} />
    </ScrollView>
  )
}

export default PetForm