//npm
import { useState } from "react"
import { StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import MultiselectDropdown from "@components/Dropdown/MultiselectDropdown"
import { MainButton, SubButton } from "@components/ButtonComponent"
//store
import { useShallowPets } from "@store/storeUtils"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface CareFormProps {
  onSubmit: (name: string, frequency: string, times: number, pets: string[], careId: string | null) => Promise<any>
  initialValues?: { name?: string, frequency?: string, times?: number, pets?: string[], careId?: string }
  navigation: any
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues, navigation }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? '')
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency ?? '')
  const [times, setTimes] = useState<number | ''>(initialValues?.times ?? '')
  const [petData, setPetData] = useState<string[]>(initialValues?.pets ?? [])
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [allowManualName, setAllowManualName] = useState<boolean>(false)

  //convert initial pet Ids into names
  const initialusePetNames = initialValues?.pets.map(id => {
    const pet = useShallowPets().find(pet => pet._id === id)
    return pet.name
  })
  
  const careId: string | null = initialValues?.careId ?? null

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
    if (!name || !frequency || !times) {
      setErrorMsg('Please enter all fields.')
    } else {
      setErrorMsg('')
      await onSubmit(name, frequency, times, petData, careId)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.container}>
        <Text style={styles.header}>{initialValues?.name ? 'Edit' : 'Add'} Tracker</Text>

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        {!!name && <Text>Enter Name</Text>}
        <Dropdown label={initialValues?.name ? initialValues.name : 'Select Name'} dataType="care" onSelect={handleSelectName} />
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
        <Dropdown label={initialValues?.frequency ? initialValues.frequency : 'Select Frequency'} dataType="frequency" onSelect={setFrequency} />
        <TextInput 
          style={styles.input} 
          placeholder='Enter Times' 
          onChangeText={(text: string) => setTimes(text !== '' ? Number(text) : '')} 
          value={times !== '' ? times.toString() : ''} 
          keyboardType="numeric"
        />
        <MultiselectDropdown label={'Select Pets'} dataType='petNames' onSelect={handleSelectPets} initials={initialusePetNames} />
        <MainButton onPress={handleSubmit} title={initialValues?.name ? 'Save' : 'Create'} top={50} bottom={10} />
        <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />

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
  error: {
    color: Colors.red,
    fontWeight: 'bold'
  }
})
 
export default CareForm