//npm
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//store && types & helpers
import { Health, HealthFormData, Visit, VisitFormData } from "@health/HealthInterface"
import * as healthHelpers from '@health/healthHelpers'
import { useShallowPetBasics } from "@store/storeUtils"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import { CheckboxButton, MainButton, SubButton } from "@components/ButtonComponent"
import MultipleInputs from "@components/MultipleInputs"
import PetPicker from "@components/PetPicker"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"
import { ErrorMessage, FormLabel, ModalInput } from "@components/UIComponents"
import { useShallowPets } from "@hooks/sharedHooks"
import useForm from "@hooks/useForm"
import { windowHeight } from "@utils/constants"
import TitleInput from "@components/TitleInput"
import { ActionButton, IconButton, ToggleButton } from "@components/ButtonComponents"
import FrequencyPicker, { frequencyMap, intervalLabel } from "@components/FrequencyPicker"
import VisitForm from "./VisitForm"
import { Header } from "@navigation/NavigationStyles"

interface InitialState extends Health {
  errors: any
  species: string
  dueDateIsManual: boolean
}
interface HealthFormProps {
  onSubmit: (formData: HealthFormData) => void
  initialValues?: Health
  navigation: any
  status: string
}

const HealthForm: React.FC<HealthFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const { petIdToColor, PET_BASICS } = useShallowPets()
  const speciesFromId = (petId: string) => {
    return PET_BASICS.find(pet => pet._id === petId).species
  }
  
  const initialState: InitialState = {
    name: initialValues?.name ?? null,
    details: initialValues?.details ?? [],
    pet: initialValues?.pet ?? PET_BASICS[0],
    type: initialValues?.type ?? 'Routine',
    repeat: initialValues?.repeat ?? false,
    frequency: initialValues?.frequency ?? { type: 'days', interval: 1, timesPerInterval: [1] },
    icon: initialValues?.icon ?? null,
    lastDone: initialValues?.lastDone ?? null,
    nextDue: initialValues?.nextDue ?? null,
    _id: initialValues?._id,
    species: initialValues?.pet?.species ?? PET_BASICS[0].species,
    errors: null,
  }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)

  const { name, details, pet, type, repeat, frequency, icon, lastDone, nextDue, _id, errors, species } = values

  const handleSelectPet = (selected: string[]) => {
    onChange('pet', selected[0])
    onChange('species', speciesFromId(selected[0]))
  }

  const editPastVisits = (inputs: Date[]) => {
    // const results = inputs.map(input => ({ date: input, notes: null }))
    // setLastDone(results)
  }
  function handleSubmit() {
    if (!repeat) ['frequency', 'lastDone', 'nextDue'].map(key => onChange(key, null))
    onSubmit({ name, details, type, pet, repeat, frequency, icon, lastDone, nextDue, _id })
  }

  const handleValidate = useCallback(() => {
    return repeat ? onValidate({ name, type }) : onValidate({ name, type, 'last visit': lastDone })
  }, [name, type, lastDone])

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightAction={handleValidate} navigation={navigation} mode='modal' />
    });
  }, [handleValidate])

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.containerWithPadding, { minHeight: windowHeight * 0.75}]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      <TitleInput initial={initialState.name} placeholder='New Vet Visit' onChange={(input: string) => onChange('name', input)} type='health' error={errors?.name} />
      { name?.toLowerCase().includes('vaccine') && (species === 'Cat' || species === 'Dog') &&
        <Dropdown label={'Select Vaccine Name'} dataType={species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={(selected: string) => onChange('details', [...details, selected])} initial={details[0]} />
      }

      <FormLabel label='Select Pets' icon="pets" width='100%' />
      <PetPicker onSelect={handleSelectPet} initials={[pet?._id ?? pet]} />

      <FormLabel label='Select Type' icon="healthType" width='100%' />
      <View style={UI.rowCon}>
        {healthHelpers.HEALTH_TYPES.map(t =>
          <IconButton key={t} size='large' type={t} onPress={() => onChange('type', t)} styles={type === t ? UI.active : UI.inactive} />
        )}
      </View>

      <FormLabel label='Previous Visits' icon="schedule" width='100%' />
        { errors?.hasOwnProperty('last visit') && <Text>{errors['last visit']}</Text> }
        {lastDone && <Text>Due on {lastDone?.dueDate.toDateString()}. Appointment {lastDone?.appointment ? '' : 'not '}scheduled</Text>}
      <ModalInput 
        label={
          <View style={{ ...Spacing.flexRow }}>
            <ActionButton title='increase' onPress={() => onChange('lastDone', { ...lastDone, dueDate: new Date(), appointment: null, notes: null, overDue: false })} />
            <Text>add visit</Text>
          </View>
        }
      >
        <VisitForm onSubmit={(formData: VisitFormData) => onChange('lastDone', formData)} pet={pet} />
      </ModalInput>

      <View style={styles.labelCon}>
        <FormLabel label='Repeat' icon="repeat" top={0} bottom={0} />
        <ToggleButton onPress={() => onChange('repeat', !repeat)} initial={repeat} size='small' />
      </View>
      { repeat &&
        <ModalInput maxHeight='90%'
          label={
            <Text>Repeats {frequency && frequencyMap[frequency.type].timesPerIntervalLabel(frequency.timesPerInterval)} {intervalLabel(frequency.interval, frequency.type)}</Text>
          }
          onReset={() => onChange('frequency', initialState.frequency)}
        >
          <FrequencyPicker initial={frequency} color={petIdToColor(pet._id)}
            onSelectFrequency={(key: string, selected: any) => onChange('frequency', frequency[key] ? { ...frequency, [key]: selected } : selected)}
          />
        </ModalInput>
      }

{/*    
      {((name === 'vax' && (species === 'Cat' || species === 'Dog')) || vaccine) &&
        <Dropdown label={'Select Vaccine Name'} dataType={species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={handleSaveVaccine} initial={vaccine} width={300} />
      }
      <Text style={styles.label}>Previous visits</Text>
      <MultipleInputs inputName='visit' type='date' initials={initialVisits} onEdit={editPastVisits} />

      <View style={styles.labelCon}>
        <Text>Next visit due in</Text>
        <View style={Spacing.flexRow}>
          <Text>Enter manually</Text>
          <CheckboxButton initial={allowManualDueDate} onPress={() => setAllowManualDueDate(!allowManualDueDate)} />
        </View>
      </View>

      {!allowManualDueDate && 
        <View style={styles.rowCon}>
          <TextInput
            style={[styles.input, { width: 110 }]}
            placeholder='Enter times'
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => setTimes(Number(text))} 
            value={(times ?? '').toString()} 
            keyboardType="numeric"
          />
          <Dropdown label='Select Frequency' dataType="healthFrequency" onSelect={setFrequency} width={185} initial={frequency} />
        </View>
      }
      

    {allowManualDueDate &&
      <View style={{ marginTop: 15 }}>
        <RNDateTimePicker themeVariant='light' value={new Date(nextDue?.date ?? new Date())} minimumDate={new Date()} onChange={(event, selectedDate) => { setNextDue({ date: selectedDate.toISOString(), notes: '' }) }} />
      </View>
    } */}
      <MainButton onPress={handleSubmit} title={status === 'pending' ? 'Submitting...' : initialValues?.name ? 'Save' : 'Create'} top={30} bottom={10} />
      <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />

    </ScrollView>
  )
}

export default HealthForm