//npm modules
import { useEffect, useMemo } from "react"
import { ActivityIndicator, DimensionValue, Text, TouchableOpacity, View } from "react-native"
//components
import { ToggleButton } from '@components/ButtonComponents'
import Dropdown from "@components/Dropdown/Dropdown"
import ColorPicker from "@components/Pickers/ColorPicker"
import IconPicker from "@components/Pickers/IconPicker"
import { DateInput, FormInput, FormLabel, Icon, InlinePicker, ModalInput, PhotoUpload, ScrollScreen, TableForm } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
//helpers & utils & hooks
import useForm from "@hooks/useForm"
import { Pet, PetFormData, PhotoFormData } from "@pet/PetInterface"
import { GENDER, SPECIES_OPTIONS, STATUS } from "@pet/petHelpers"
import { getPetIconSource } from "@utils/ui"
//styles
import { Colors, Spacing } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"

interface InitialState extends PetFormData {
  photoData: { uri: string, name: string, type: 'image/jpeg' } | null
  errors: any
}
interface PetFormProps {
  onSubmit: (formData: PetFormData, photoData: PhotoFormData | null) => Promise<any>
  initialValues?: PetFormData
  formStatus: string
  navigation: any
}

const SpeciesBreedSelector = ({ species, breed, initials, onSelectSpecies, onSelectBreed }: { species: Pet['species'], breed: Pet['breed'], initials: { species: Pet['species'], breed: Pet['breed'] }, onSelectSpecies: (selected: Pet['species']) => void, onSelectBreed: (selected: Pet['breed']) => void }) => (
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
      <IconPicker selected={species} options={SPECIES_OPTIONS} withCustom={true} initial={initials.species} onSelect={(selected: string) => {
        onSelectSpecies(selected)
        onSelectBreed(null)
      }} customIcon={{ type: 'pet', name: 'Others' }} customLabel="breed" />

      { ['Dog', 'Cat', 'Bird', 'Fish'].includes(species) && <>
        <FormLabel label='Pet Breed' icon='pets' />
        <Dropdown withSearch={true} label='Search Breed' dataType={species} onSelect={(selected: string) => onSelectBreed(selected)} initial={breed} width={80} contentPosition="top" />
      </> }
    </View>
  </ModalInput>
)

const AlteredInfo = ({ altered, onChange, gender, color }: { altered: Pet['altered'], onChange: (data: Pet['altered']) => void, gender: Pet['gender'], color: number }) => {
  const alteredTable = [
    { key: 'alteredValue', label: 'Altered', icon: 'altered', value: 
      <ToggleButton isOn={altered.value} onPress={() => onChange({ value: !altered.value, date: null })} /> 
    },
    { key: 'alteredDate', label: 'Surgery Date', icon: 'schedule', value: 
      <DateInput date={altered.date} placeholder='Unknown' onChangeDate={(selected) => onChange({ ...altered, date: selected })} color={color} /> 
    },
  ]

  return (
    <ModalInput label={altered.value ? 
      `${gender === 'Boy' ? 'Neutered' : gender === 'Girl' ? 'Spayed' : 'Altered'} on ${altered.date ? new Date(altered.date).toLocaleDateString() : 'unknown date'}`
      : `Not ${gender === 'Boy' ? 'Neutered' : gender === 'Girl' ? 'Spayed' : 'Altered'}`
    }>
      <TableForm table={alteredTable} />
    </ModalInput>
  )
}

const StatusInfo = ({ status, onChange, color }: { status: Pet['status'], onChange: (data: Pet['status']) => void, color: number }) => {
  const handleSelectStatus = (selected: string) => {
    selected === 'Healthy'
      ? onChange({ ...status, value: selected, date: null, archive: false })
      : onChange({ ...status, value: selected, date: null })
  }

  const renderStatusArchive = (
    <View style={Spacing.flexRow}>
      <Text style={{ marginRight: 15 }}>Archive</Text>
      <ToggleButton isOn={status.archive} onPress={() => onChange({ ...status, archive: !status.archive })} />
    </View>
  )

  const statusTable = [
    { key: 'statusValue', icon: 'status', value: 
      <Dropdown label='Status' dataType="petStatus" initial={status.value} onSelect={handleSelectStatus} width={50} withBorder={false} buttonTextStyles={{ textAlign: 'right' }} /> 
    },
    { key: 'statusDate', icon: 'schedule', value: 
      <DateInput date={status.date} placeholder='Unknown date' onChangeDate={(selected) => onChange({ ...status, date: selected })} color={color} />
    },
    { key: 'statusArchive', icon: 'archive', value: renderStatusArchive },
  ]

  return (
    <ModalInput height='40%' customLabel={
      <View style={Spacing.flexRow}>
        <Text style={{ marginRight: 10 }}>{status.value}</Text>
        <Icon name={status.archive ? 'hide' : 'show'} />
      </View>
    }>
      <TableForm table={statusTable} dependentRows={{ statusDate: status.value === STATUS[1] }} />
    </ModalInput>
  )
}

const PetForm = ({ onSubmit, initialValues, navigation, formStatus }: PetFormProps) => {
  const initialState: InitialState = useMemo(() => ({ 
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
  const { name, gender, species, breed, dob, gotchaDate, altered, status, color, photo, petId, errors }: InitialState = values

  const placeholderPhoto = useMemo(() => {
    let icon: string
    if (species) {
      icon = species === 'Dog' || species === 'Cat' ? `${species}Profile` : 'OtherProfile'
    }
    else icon = 'OtherProfile'
    return getPetIconSource(icon)
  }, [species])

  const handleValidate = () => onValidate({ name, 'type': species })
  
  function handleSubmit() {
    const photoData = photo && photo !== initialState.photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    onSubmit({ name, gender, species, breed, dob, gotchaDate, altered, status, color, petId }, photoData)
  }

  const mainTable = [
    { key: 'type', label: 'Type', icon: 'pet', value: 
      <SpeciesBreedSelector species={species} breed={breed} initials={{ species: initialState.species, breed: initialState.breed }} onSelectSpecies={(selected) => onChange('species', selected)} onSelectBreed={(selected) => onChange('breed', selected)} /> 
    },
    { key: 'dob', label: 'Date of Birth', icon: 'birthday', value:
      <DateInput date={dob} placeholder='Unknown' header='Date of Birth' onChangeDate={(selected) => onChange('dob', selected)} color={color} /> 
    },
    { key: 'adopt', label: 'Adoption Date', icon: 'adopt', value: 
      <DateInput date={gotchaDate} placeholder='Unknown' onChangeDate={(selected) => onChange('gotchaDate', selected)} color={color} /> 
    }, 
    { key: 'gender', label: 'Gender', icon: 'gender', value: 
      <InlinePicker selected={gender} options={GENDER} onSelect={(selected) => onChange('gender', selected)} />
    },
    { key: 'altered', label: 'Altered', icon: 'altered', value: 
      <AlteredInfo altered={altered} onChange={(data) => onChange('altered', data)} gender={gender} color={color} />
    },
    { key: 'status', label: 'Status', icon: 'status', value: 
      <StatusInfo status={status} onChange={(data) => onChange('status', data)} color={color} />
    },
  ]

  const headerActions = [
    { icon: 'reset', onPress: onReset },
    { title: formStatus === 'pending' ? 
      <Text style={Spacing.flexRow}><ActivityIndicator /> Submitting...</Text>
      : 'Submit', onPress: handleValidate },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' bgColor={Colors.multi.lightest[color]} />
    })
  }, [headerActions, status, color])

  return ( 
    <ScrollScreen bgColor={Colors.multi.lightest[color]}>
      <View style={styles.headerCon}>
        <PhotoUpload photo={photo} placeholder={placeholderPhoto} onSelect={(uri: string) => onChange('photo', uri)} />
        <View style={styles.titleCon}>
          <FormInput initial={initialState.name} placeholder="New Pet Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} />
        </View>
      </View>
      
      <ColorPicker selected={color} onPress={selected => onChange('color', selected)} />

      <TableForm table={mainTable} />
    </ScrollScreen>
  )
}

export default PetForm