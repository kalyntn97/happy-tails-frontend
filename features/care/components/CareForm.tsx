//npm
import { useState } from "react"
import { StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, useWindowDimensions } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import MultiselectDropdown from "@components/Dropdown/MultiselectDropdown"
import { MainButton, SubButton } from "@components/ButtonComponent"
//types
import { Pet } from "@pet/PetInterface"
//store
import { usePetIds } from "@store/storeUtils"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { usePets } from "@store/store"

interface CareFormProps {
  onSubmit: (name: string, pets: string[], repeat: boolean, ending: boolean, date: Date, endDate: Date | null, frequency: string, times: number, careId: string | null) => void
  initialValues?: { name?: string, repeat?: boolean, ending?: boolean, date?: Date, endDate?: Date, frequency?: string, times?: number, pets?: Pet[], careId?: string }
  navigation: any
  status: string
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const initialPetNames = initialValues?.pets.map(pet => pet.name) ?? null
  const initialPets = initialValues?.pets.map(pet => pet._id)
  const pets = usePetIds()
  const height = useWindowDimensions().height

  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [petData, setPetData] = useState<string[]>(initialPets ?? [])
  const [repeat, setRepeat] = useState<boolean>(initialValues?.repeat ?? false)
  const [ending, setEnding] = useState<boolean>(initialValues?.ending ?? false)
  const [date, setDate] = useState<Date | null>(initialValues?.date ?? new Date())
  const [endDate, setEndDate] = useState<Date | null>(initialValues?.endDate ?? null)
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency ?? null)
  const [times, setTimes] = useState<number>(initialValues?.times ?? null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [allowManualName, setAllowManualName] = useState<boolean>(false)

  const careId: string | null = initialValues?.careId ?? null
  // handle input custom name for form
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


  // handle select multiple pets
  const handleSelectPets = (selected: string[]) => {
    // convert names into ids before submitting
    const petIds = selected.map(name => {
      const pet = pets.find(pet => pet.name === name)
      return pet._id
    })
    setPetData(petIds)
  }

  const handleSubmit = async () => {
    if (!name || !petData.length || !date) {
      setErrorMsg('Please enter all fields.')
    } else {
      setErrorMsg('')
      if (!ending) {
        setEndDate(null)
      }
      // console.log(name, petData, repeat, ending, date, endDate, frequency, times, careId)
      await onSubmit(name, petData, repeat, ending, date, endDate, frequency, times, careId)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <ScrollView
        contentContainerStyle={[styles.container, { minHeight: height * 0.75}]}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        <Text style={styles.header}>{initialValues?.name ? 'Edit' : 'Add'} Tracker</Text>

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        {!!name && <Text>Enter Name</Text>}
        <Dropdown label={'Select Name'} dataType="care" onSelect={handleSelectName} initial={name} />
        {allowManualName && 
          <TextInput 
            style={styles.input}
            placeholder="Specify name"
            onChangeText={(text: string) => setName(text)}
            value={name}
            autoCapitalize="words"
          />
        }
        <MultiselectDropdown label={'Select Pets'} dataType='petNames' onSelect={handleSelectPets} initials={initialPetNames} />

        <View style={styles.rowCon}>
          <Text style={styles.rowText}>{repeat ? 'Start Date' : 'Date'}</Text>
          <RNDateTimePicker value={new Date(date)} minimumDate={new Date(date)} onChange={(event, selectedDate) => { setDate(selectedDate) }} accentColor={Colors.darkPink} />
        </View>

        {repeat &&
          <>
            {!!frequency && <Text>Select Frequency</Text>}
            <Dropdown label={'Select Frequency'} dataType="frequency" onSelect={setFrequency} initial={frequency} />
            
            <TextInput 
              style={styles.input} 
              placeholder='Enter Times' 
              onChangeText={(text: string) => setTimes(Number(text))} 
              value={(times ?? '').toString()} 
              keyboardType="numeric"
            />
          </>
        }
        
        {repeat &&
          <View style={styles.rowCon}>
            <Text style={styles.rowText}>Set end date? (optional)</Text>
            <TouchableOpacity onPress={() => setEnding(!ending)}>
              <Text style={styles.rowTextFocus}>{ending ? '☑︎' : '☐'}</Text>
            </TouchableOpacity>
          </View>
        }
        {repeat && ending &&
          <View style={styles.rowCon}>
            <Text style={styles.rowText}>End Date</Text>
            <RNDateTimePicker value={new Date(endDate) ?? new Date()} minimumDate={new Date(date)} onChange={(event, selectedDate) => { setEndDate(selectedDate) }} accentColor={Colors.darkPink} />
          </View>
        }

        <View style={styles.bottomCon}>
          <View style={[styles.rowCon]}>
            <Text style={styles.rowText}>Repeat is</Text>
            <TouchableOpacity onPress={() => setRepeat(!repeat)}>
              <Text style={[styles.rowTextFocus, { color: repeat ? Colors.green : Colors.red }]}>{repeat ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
          </View>

          <MainButton onPress={handleSubmit} title={status === 'pending' ? 'Submitting...' : initialValues?.name ? 'Save' : 'Create'} top={30} bottom={10} />
          <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />
        </View>

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
  input: {
    ...Forms.input,
    borderColor: Colors.pink,
  },
  error: {
    color: Colors.red,
    fontWeight: 'bold'
  },
  rowCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-around',
    width: 250,
    marginVertical: 15,
  },
  rowText: {
    fontSize: 15
  },
  rowTextFocus: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomCon: {
    ...Spacing.flexColumn,
    marginTop: 'auto',
  },
})
 
export default CareForm