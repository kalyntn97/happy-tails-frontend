//npm
import { useState } from "react"
import { StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native"
//components
import Dropdown from "./Dropdown"
import { usePetContext } from "../context/PetContext"
//utils
import { getPetNames } from "../utils/careUtils"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CareFormProps {
  onSubmit: (name: string, frequency: string, times: number, pets: string[]) => Promise<any>
  initialValues?: { name?: string, frequency?: string, times?: number, petData?: string[] }
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues }) => {
  const [name, setName] = useState<string>(initialValues?.name || '')
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency || '')
  const [times, setTimes] = useState<number | ''>(initialValues?.times || '')
  const [petData, setPetData] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [allowManualName, setAllowManualName] = useState<boolean>(false)

  const { pets } = usePetContext()

  const handleSelectName = (selected: string) => {
    if (selected === 'Others') {
      setName('')
      setAllowManualName(true)
    } else {
      setAllowManualName(false)
      setName(selected)
    }
  } 

  const handleSelectPets = (selected: string) => {
    const petIds = [...petData, selected].map(name => {
      const pet = pets.find(pet => pet.name === name)
      return pet._id
    })
    console.log(petIds)
    setPetData(petIds)
  }

  const handleSubmit = async () => {
    if (!name || !frequency || !times) {
      setErrorMsg('Please enter all fields.')
    } else {
      setErrorMsg('')
      const result = await onSubmit(name, frequency, times, petData)
      console.log('result', result)
      if (result && result.error) {
        alert(result.msg)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>

      <View style={styles.container}>
        <Text style={styles.header}>{initialValues?.name ? 'Edit' : 'Add'} Tracker</Text>

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        {!!name && <Text>Enter Name</Text>}
        <Dropdown label='Select Name' dataType="care" onSelect={handleSelectName} />
        {allowManualName && 
          <TextInput 
            style={styles.input}
            placeholder="Specify name"
            onChangeText={(text: string) => setName(text)}
            value={name}
            autoCapitalize="words"
          />
        }
        {!!frequency && <Text>Select Frequency</Text>}
        <Dropdown label='Select Frequency' dataType="frequency" onSelect={setFrequency} />
        <TextInput 
          style={styles.input} 
          placeholder='Enter Times' 
          onChangeText={(text: string) => setTimes(text !== '' ? Number(text) : '')} 
          value={times !== '' ? times.toString() : ''} 
          keyboardType="numeric"
        />
        <Dropdown label='Select Pets' dataType='petNames' onSelect={handleSelectPets} />
        <TouchableOpacity onPress={handleSubmit} style={styles.mainButton}>
          <Text style={styles.buttonText}>{initialValues?.name ? 'Save' : 'Create'}</Text>
        </TouchableOpacity>
      </View>
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
  mainButton: {
    ...Buttons.smallRounded,
    marginTop: 50,
    backgroundColor: Colors.pink
  },
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  },
  subBtn: {
    ...Buttons.smallSub
  },
  error: {
    color: Colors.red,
    fontWeight: 'bold'
  }
})
 
export default CareForm