//npm
import { useState } from "react"
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//store && types
import { usePets } from "@store/store"
import { Pet } from "@pet/PetInterface"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import { MainButton, SubButton } from "@components/ButtonComponent"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import MultipleInputs from "../../../components/MultipleInputs"

interface HealthFormProps {
  onSubmit: (pet: string, type: string, name: string, vaccine: string, times: number, frequency: string, lastDone: Date[], nextDue: Date, healthId: string) => void
  initialValues?: {pet?: Pet, type?: string, name?: string, vaccine?: string, times?: number, frequency?: string, lastDone?: Date[], nextDue?: Date, healthId?: string}
  navigation: any
  status: string
}

const HealthForm: React.FC<HealthFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const pets = usePets()
  const initialPetName = pets.find(p => p._id === initialValues?.pet._id)?.name ?? null
  const [pet, setPet] = useState<string>(initialValues?.pet._id ?? null)
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [vaccine, setVaccine] = useState<string>(initialValues?.vaccine ?? null)
  const [type, setType] = useState<string>(initialValues?.type ?? 'Routine')
  const [times, setTimes] = useState<number>(initialValues?.times ?? null)
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency ?? null)
  const [lastDone, setLastDone] = useState<Date[]>(initialValues?.lastDone ?? null)
  const [nextDue, setNextDue] = useState<Date>(initialValues?.nextDue ?? null)

  const [species, setSpecies] = useState<string>(null)
  const [allowManualName, setAllowManualName] = useState<boolean>(false)
  const [allowManualDueDate, setAllowManualDueDate] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>(null)

  const healthId: string | null = initialValues?.healthId ?? null

  const handleSelectName = (selected: string) => {
    setName(() => {
      if (selected === 'Others') {
        setAllowManualName(true)
        return ''
      } else {
        setAllowManualName(false)
        return selected
      }
    })
  }

  const handleSelectPet = (selected: string) => {
    const pet = pets.find(pet => pet.name === selected)
    setPet(pet._id)
    setSpecies(pet.species)
    if (vaccine) setVaccine(null)
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>{initialValues?.name ? 'Edit' : 'Add'} a Vet Record</Text>

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        <Dropdown label={'Select Pet'} dataType="petNames" onSelect={handleSelectPet} initial={initialPetName} />

        <Dropdown label={'Select Type'} dataType="healthTypes" onSelect={setType} initial={type} />
      
        {!!name && <Text>Enter Name</Text>}
        <Dropdown label={'Select Name'} dataType="health" onSelect={handleSelectName} initial={name} />

        {allowManualName && 
          <TextInput 
            style={styles.input}
            placeholder="Specify name"
            onChangeText={(text: string) => setName(text)}
            value={name}
            autoCapitalize="words"
          />
        }
        {name === 'Vaccine' && (species === 'Cat' || species === 'Dog') &&
          <Dropdown label={'Select Vaccine Name'} dataType={species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={setVaccine} initial={vaccine} />
        }
        
        <Text style={styles.subText}>(Press + to add, - to remove dates)</Text>
        <MultipleInputs label='Last Done' type='Date' initials={lastDone} onPress={setLastDone}/>

        {!allowManualDueDate && 
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Due In</Text>
            <TextInput
              style={[Forms.inputBase, { width: 50 }]}
              placeholder='1' 
              onChangeText={(text: string) => setTimes(Number(text))} 
              value={(times ?? '').toString()} 
              keyboardType="numeric"
            />
            <Dropdown label='...' dataType="healthFrequency" onSelect={setFrequency} width={120} initial={frequency} />
          </View>
        }
        <View style={styles.checkboxContainer}>
          <Text>Or enter manually</Text>
          <TouchableOpacity style={styles.checkbox} onPress={() => setAllowManualDueDate(!allowManualDueDate)}>
            <Text style={styles.check}>{allowManualDueDate ? '✓' : ''}</Text>
          </TouchableOpacity>
        </View>

      {allowManualDueDate &&
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Next Due</Text>
            <RNDateTimePicker value={nextDue ?? new Date()} minimumDate={new Date()} onChange={(event, selectedDate) => { setNextDue(selectedDate) }}/>
          </View>

      }
        <MainButton onPress={handleSubmit} title={status === 'pending' ? 'Submitting...' : initialValues?.name ? 'Save' : 'Create'} top={30} bottom={10} />
        <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />

      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Forms.form,
  },
  header: {
    ...Typography.mainHeader,
    color: Colors.darkPink
  },
  error: {
    color: Colors.red,
    fontWeight: 'bold'
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
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    ...Spacing.centered,
    marginHorizontal: 10,
  },
  check: {
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