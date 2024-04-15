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
  const initialVisits = initialValues?.lastDone.map(visit => visit.date)

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

  const addPastVisits = (inputs: Date[]) => {
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
      {errorMsg && <Text style={{ ...Typography.errorMsg }}>{errorMsg}</Text>}

      <Dropdown label={'Select Pet'} dataType="petNames" onSelect={handleSelectPet} initial={initialPetName} />

      <Dropdown label={'Select Type'} dataType="healthTypes" onSelect={setType} initial={type} />
    
      {!!name && <Text>Enter Name</Text>}
      <Dropdown label={'Select Name'} dataType="health" onSelect={handleSelectName} initial={name} />

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
      {(name === 'vax' && (species === 'Cat' || species === 'Dog')) || vaccine &&
        <Dropdown label={'Select Vaccine Name'} dataType={species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={handleSaveVaccine} initial={vaccine} />
      }
      
      <Text style={styles.subText}>(Press + to add, - to remove dates)</Text>
      <MultipleInputs label='Last Done' type='Date' initials={initialVisits} onPress={addPastVisits}/>

      {!allowManualDueDate && 
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Due In</Text>
          <TextInput
            style={[Forms.inputBase, { width: 50 }]}
            placeholder='1'
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => setTimes(Number(text))} 
            value={(times ?? '').toString()} 
            keyboardType="numeric"
          />
          <Dropdown label='...' dataType="healthFrequency" onSelect={setFrequency} width={120} initial={frequency} />
        </View>
      }
      <View style={styles.checkboxContainer}>
        <Text>Or enter manually</Text>
        <CheckboxButton initial={allowManualDueDate} onPress={() => setAllowManualDueDate(!allowManualDueDate)} />
      </View>

    {allowManualDueDate &&
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Next Due</Text>
          <RNDateTimePicker value={new Date(nextDue?.date ?? new Date())} minimumDate={new Date()} onChange={(event, selectedDate) => { setNextDue({ date: selectedDate, notes: '' }) }}/>
        </View>

    }
      <MainButton onPress={handleSubmit} title={status === 'pending' ? 'Submitting...' : initialValues?.name ? 'Save' : 'Create'} top={30} bottom={10} />
      <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Forms.form,
  },
  header: {
    ...Typography.mainHeader,
    color: Colors.pink.dark
  },
  input: {
    ...Forms.input,
  },
  rowContainer: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: 270,
    marginVertical: 15,
  },
  label: {
    fontSize: 15,
  },
  checkboxContainer: {
    ...Spacing.flexRow,
    margin: 10,
  },
  subText: {
    ...Typography.smallSubBody,
  }
})

export default HealthForm