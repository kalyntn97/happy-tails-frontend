//npm
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//store && types & helpers
import { usePets } from "@store/store"
import { Pet } from "@pet/PetInterface"
import { Visit, VisitFormData } from "@health/HealthInterface"
import * as healthHelpers from '@health/healthHelpers'
//components
import Dropdown from "@components/Dropdown/Dropdown"
import { CheckboxButton, MainButton, SubButton } from "@components/ButtonComponent"
import MultipleInputs from "@components/MultipleInputs"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { styles } from "@styles/FormStyles"
import { ErrorMessage } from "@components/UIComponents"

interface HealthFormProps {
  onSubmit: (pet: string, type: string, name: string, vaccine: string, times: number, frequency: string, lastDone: VisitFormData[], nextDue: VisitFormData, healthId: string) => void
  initialValues?: {pet?: Pet, type?: string, name?: string, vaccine?: string, times?: number, frequency?: string, lastDone?: Visit[], nextDue?: Visit, healthId?: string}
  navigation: any
  status: string
}

const HealthForm: React.FC<HealthFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const pets = usePets()
  const initialPetName = pets.find(p => p._id === initialValues?.pet._id)?.name ?? null
  const [pet, setPet] = useState<string>(initialValues?.pet._id ?? null)
  const [name, setName] = useState<string>(healthHelpers.HEALTHS[initialValues?.name] ?? null)
  const [vaccine, setVaccine] = useState<string>(healthHelpers.VACCINES[initialValues?.vaccine]?.name ?? null)
  const [type, setType] = useState<string>(initialValues?.type ?? 'Routine')
  const [times, setTimes] = useState<number>(initialValues?.times ?? null)
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency ?? null)
  const [lastDone, setLastDone] = useState<Visit[] | VisitFormData[]>(initialValues?.lastDone ?? [])
  const [nextDue, setNextDue] = useState<Visit | VisitFormData>(initialValues?.nextDue ?? null)

  const [species, setSpecies] = useState<string>(null)
  const [allowManualName, setAllowManualName] = useState<boolean>(false)
  const [allowManualDueDate, setAllowManualDueDate] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>(null)

  const healthId: string | null = initialValues?.healthId ?? null
  const initialVisits = lastDone.map((visit: Visit) => visit.date)

  const handleSelectName = (selected: string) => {
    setName(() => {
      if (selected === 'Others') {
        setAllowManualName(true)
        return ''
      } else {
        setAllowManualName(false)
        const healthKey: string = healthHelpers.healthKeyFromName[selected]
        return healthKey
      }
    })
  }

  const handleSelectPet = (selected: string) => {
    const pet = pets.find(pet => pet.name === selected)
    setPet(pet._id)
    setSpecies(pet.species)
    if (vaccine) setVaccine(null)
  }

  const handleSaveVaccine = (vaccineName: string) => {
    const vaccineAbbr: string = healthHelpers.vaccineKeyFromName[vaccineName]
    return setVaccine(vaccineAbbr)
  }

  const editPastVisits = (inputs: Date[]) => {
    const results = inputs.map(input => ({ date: input, notes: null }))
    setLastDone(results)
  }

  const handleSubmit = () => {
    if (!name || !times || !frequency || !pet || !type) {
      setErrorMsg('Please enter all fields.')
    } else {
      setErrorMsg('')
      onSubmit(pet, type, name, vaccine, times, frequency, lastDone, nextDue, healthId)
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {errorMsg && <ErrorMessage error={errorMsg} />}

      <Text style={styles.label}>Pet</Text>
      <Dropdown label={'Select Pet'} dataType="petNames" onSelect={handleSelectPet} initial={initialPetName} width={300} />

      <View style={styles.labelCon}>
        <Text>Name</Text>
        <Text>Type</Text>
      </View>
      <View style={styles.rowCon}>
        <Dropdown label={'Select Name'} dataType="health" onSelect={handleSelectName} initial={name} width={175} />
        <Dropdown label={'Select Type'} dataType="healthTypes" onSelect={setType} initial={type} width={120} />
      </View>
    
      {allowManualName && 
        <TextInput 
          style={styles.input}
          placeholder="Specify name"
          placeholderTextColor={Colors.shadow.reg}
          onChangeText={(text: string) => setName(text)}
          value={name}
          autoCapitalize="words"
        />
      }
      {((name === 'vax' && (species === 'Cat' || species === 'Dog')) || vaccine) &&
        <Dropdown label={'Select Vaccine Name'} dataType={species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={handleSaveVaccine} initial={vaccine} width={300} />
      }
      <Text style={styles.label}>Previous visits</Text>
      <MultipleInputs inputName='visit' type='date' initials={initialVisits} onEdit={editPastVisits} />

      <View style={styles.labelCon}>
        <Text>Next visit due in</Text>
        <View style={{ ...Spacing.flexRow }}>
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
    }
      <MainButton onPress={handleSubmit} title={status === 'pending' ? 'Submitting...' : initialValues?.name ? 'Save' : 'Create'} top={30} bottom={10} />
      <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />

    </ScrollView>
  )
}

export default HealthForm