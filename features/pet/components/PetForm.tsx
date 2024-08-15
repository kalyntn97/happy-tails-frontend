//npm modules
import { useEffect, useMemo } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
//components
import { ToggleButton } from '@components/ButtonComponents'
import Dropdown from "@components/Dropdown/Dropdown"
import ColorPicker from "@components/Pickers/ColorPicker"
import IconPicker from "@components/Pickers/IconPicker"
import { DateInput, FormInput, FormLabel, Icon, ModalInput, PhotoUpload, ScrollContainer, TableForm } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
//helpers & utils & hooks
import useForm from "@hooks/useForm"
import { Pet, PetFormData, PhotoFormData } from "@pet/PetInterface"
import { GENDER, SPECIES_OPTIONS, STATUS } from "@pet/petHelpers"
import { getPetIconSource } from "@utils/ui"
//styles
import { Colors, Spacing } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"

interface PetFormProps {
  onSubmit: (formData: PetFormData, photoData: PhotoFormData | null) => Promise<any>
  initialValues?: PetFormData
  formStatus: string
  navigation: any
  setColor: (color: number) => void
}

const PetForm = ({ onSubmit, initialValues, navigation, formStatus, setColor }: PetFormProps) => {
  const initialState = useMemo(() => ({ 
    name: initialValues?.name ?? null, 
    species: initialValues?.species ?? SPECIES_OPTIONS[0].title, 
    breed: initialValues?.breed ?? null, 
    gender: initialValues?.gender ?? GENDER[2], 
    dob: initialValues?.dob ?? null, 
    gotchaDate: initialValues?.gotchaDate ?? null, 
    altered: initialValues?.altered ?? { value: false, date: null }, 
    status: initialValues?.status ?? { value: 'Healthy', date: null, archive: false }, 
    color: initialValues?.color ?? 0, 
    photo: initialValues?.photo ?? null, 
    petId: initialValues?.petId ?? null, 
    photoData: null, 
    errors: {} 
  }), [initialValues])

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, gender, species, breed, dob, gotchaDate, altered, status, color, photo, petId, errors } = values

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

  const handleValidate = () => {
    onValidate({ name, 'type': species })
  }

  function handleSubmit() {
    const photoData = photo && photo !== initialState.photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    onSubmit({ name, gender, species, breed, dob, gotchaDate, altered, status, color, petId }, photoData)
  }

  const renderType = (
    <ModalInput height='90%' customLabel={
      <View style={[Spacing.flexRow, { flexWrap: 'wrap' }]}>
        <Icon type='pet' name={species} styles={{ marginRight: 10 }} />
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
    <DateInput date={gotchaDate} placeholder='Unknown' onChangeDate={(selected) => onChange('gotchaDate', selected)} color={color} />
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
      <TableForm table={alteredTable} withTitle={true} />
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
        <Icon name={status.archive ? 'hide' : 'show'} />
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

  const headerActions = [
    { icon: 'reset', onPress: onReset },
    { title: status === 'pending' ? 'Submitting...' : 'Submit', onPress: handleValidate },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' bgColor={Colors.multi.lightest[color]} />
    })
  }, [headerActions, status, color])

  return ( 
    <View style={styles.container}>
      <View style={styles.headerCon}>
        <PhotoUpload photo={photo} placeholder={placeholderPhoto} onSelect={(uri: string) => onChange('photo', uri)} />
        <View style={[styles.titleCon, { flex: 1 }]}>
          <FormInput initial={initialState.name} placeholder="New Pet Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} />
        </View>
      </View>
      
      <ColorPicker selected={color} onPress={selected => {
        onChange('color', selected)
        setColor(selected)
      }} />

      <TableForm table={mainTable} withTitle={true} />

    </View>
  )
}

export default PetForm