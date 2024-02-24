//npm
import { useState } from "react"
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//context
import { usePetContext } from "../../context/PetContext"
//components
import Dropdown from "../Dropdown"
import { MainButton, SubButton } from "../ButtonComponent"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../../styles'

interface HealthFormProps {
  onSubmit: (name: string, vaccine: string, type: string, times: number, frequency: string, lastDone: Date, nextDue: Date, pet: string) => Promise<any>
  initialValues?: {name?: string, vaccine?: string, type?: string, times?: number, frequency?: string, lastDone?: Date, nextDue?: Date, pet?: string, vetId?: string}
  navigation: any
}

const HealthForm: React.FC<HealthFormProps> = ({ onSubmit, initialValues, navigation }) => {
  const [pet, setPet] = useState<string>(initialValues?.pet ?? '')
  const [name, setName] = useState<string>(initialValues?.name ?? '')
  const [vaccine, setVaccine] = useState<string>(initialValues?.vaccine ?? '')
  const [type, setType] = useState<string>(initialValues?.type ?? 'Routine')
  const [times, setTimes] = useState<number | ''>(initialValues?.times ?? '')
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency ?? '')
  const [lastDone, setLastDone] = useState<Date>(initialValues?.lastDone ?? null)
  const [nextDue, setNextDue] = useState<Date>(initialValues?.nextDue ?? null)

  const [species, setSpecies] = useState<string>('')
  const [allowManualName, setAllowManualName] = useState<boolean>(false)
  const [allowManualDueDate, setAllowManualDueDate] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const { pets } = usePetContext()

  const initialPetName = () => {
    const pet = pets.find(pet => pet._id === initialValues?.pet)
    return pet.name
  }

  const vetId: string | null = initialValues?.vetId ?? null

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
  }

  const handleSubmit = async () => {
    if (!name || !times || !frequency || !pet || !type) {
      setErrorMsg('Please enter all fields.')
    } else {
      //calculate next due date
      if (times && frequency && lastDone)  {
        const date = lastDone.getDate()
        const month = lastDone.getMonth()
        const year = lastDone.getFullYear()
        const nextDueDate = new Date(lastDone)
        switch (frequency) {
          case 'day(s)': nextDueDate.setDate(date + Number(times)); break
          case 'week(s)': nextDueDate.setDate(date + Number(times) * 7); break
          case 'month(s)':
            const newMonth = month + Number(times)
            nextDueDate.setMonth(newMonth % 12) //handle month rollover
            nextDueDate.setFullYear(year + Math.floor(newMonth / 12)) //handle year rollover
            break
          case 'year(s)': nextDueDate.setFullYear(year + Number(times)); break
        }
        setNextDue(nextDueDate)
      }
      setErrorMsg('')
      await onSubmit(pet, type, name, vaccine, times, frequency, lastDone, nextDue, vetId)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{initialValues?.name ? 'Edit' : 'Add'} a Vet Record</Text>

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        <Dropdown label={initialValues?.pet ? initialValues.pet : 'Select Pet'} dataType="petNames" onSelect={handleSelectPet} />

        <Dropdown label={initialValues?.type ?? 'Routine'} dataType="healthTypes" onSelect={setType} />
      
        {!!name && <Text>Enter Name</Text>}
        <Dropdown label={initialValues?.name ? initialValues.name : 'Select Name'} dataType="health" onSelect={handleSelectName} />

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
          <Dropdown label='Select Vaccine Name' dataType={species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={setVaccine} />
        }


        <Text style={styles.label}>Last Done</Text>
        <RNDateTimePicker value={lastDone ?? new Date()} maximumDate={new Date()} onChange={(event, selectedDate) => { setLastDone(selectedDate) }} accentColor={Colors.darkPink} />

        <Text style={styles.label}>Next Due</Text>
        {!allowManualDueDate && 
          <View style={styles.rowContainer}>
            <Text>In</Text>
            <TextInput
              style={[styles.input, { width: 50 }]}
              placeholder='1' 
              onChangeText={(text: string) => setTimes(text !== '' ? Number(text) : '')} 
              value={times !== '' ? times.toString() : ''} 
              keyboardType="numeric"
            />
            <Dropdown label={initialValues?.frequency ? initialValues.frequency : '...'} dataType="healthFrequency" onSelect={setFrequency} width={120} />
          </View>
        }
        {/* <View style={styles.checkboxContainer}>
          <Text>Or enter manually</Text>
          <TouchableOpacity style={styles.checkbox} onPress={() => setAllowManualDueDate(!allowManualDueDate)}>
            <Text style={styles.check}>{allowManualDueDate ? '✓' : ''}</Text>
          </TouchableOpacity>
        </View>

      {allowManualDueDate &&
        <RNDateTimePicker value={nextDue ?? new Date()} minimumDate={new Date()} onChange={(event, selectedDate) => { setNextDue(selectedDate) }}/>
      } */}
        <MainButton onPress={handleSubmit} title={initialValues?.name ? 'Save' : 'Create'} top={50} bottom={10} />
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
    borderColor: Colors.pink,
  },
  rowContainer: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 10,
    marginTop: 20,
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
})

export default HealthForm