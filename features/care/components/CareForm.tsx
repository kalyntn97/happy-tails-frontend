//npm
import { useState } from "react"
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, useWindowDimensions, Pressable } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import MultiselectDropdown from "@components/Dropdown/MultiselectDropdown"
import { CheckboxButton, MainButton, SubButton, ToggleButton } from "@components/ButtonComponent"
import ColorPickingPanel from "@components/ColorPickingPanel"
//types
import { Pet } from "@pet/PetInterface"
import { CARES, careKeyFromName } from "@care/careHelpers"
//store
import { usePetIds } from "@store/storeUtils"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { styles } from "@styles/FormStyles"
import { ErrorMessage } from "@components/UIComponents"

interface CareFormProps {
  onSubmit: (name: string, pets: string[], repeat: boolean, ending: boolean, date: Date, endDate: Date | null, frequency: string, times: number, color: number, careId: string | null) => void
  initialValues?: { name?: string, pets?: Pet[], repeat?: boolean, ending?: boolean, date?: Date, endDate?: Date, frequency?: string, times?: number,  color: number, careId?: string }
  navigation: any
  status: string
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const initialPetNames = initialValues?.pets.map(pet => pet.name) ?? null
  const initialPets = initialValues?.pets.map(pet => pet._id)
  const pets = usePetIds()
  const height = useWindowDimensions().height

  const [name, setName] = useState<string>((CARES[initialValues?.name] || initialValues?.name) ?? null)
  const [petData, setPetData] = useState<string[]>(initialPets ?? [])
  const [repeat, setRepeat] = useState<boolean>(initialValues?.repeat ?? false)
  const [ending, setEnding] = useState<boolean>(initialValues?.ending ?? false)
  const [date, setDate] = useState<Date | null>(initialValues?.date ?? new Date())
  const [endDate, setEndDate] = useState<Date | null>(initialValues?.endDate ?? null)
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency ?? null)
  const [times, setTimes] = useState<number>(initialValues?.times ?? null)
  const [color, setColor] = useState<number>(initialValues?.color ?? 0)
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
        const careKey = careKeyFromName[selected]
        return careKey
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
      if (!repeat) {
        setFrequency(null)
        setTimes(null)
        setEndDate(null)
      }
      if (!ending) {
        setEndDate(null)
      }
      onSubmit(name, petData, repeat, ending, date, endDate, frequency, times, color, careId)
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.container, { minHeight: height * 0.75}]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      {errorMsg && <ErrorMessage error={errorMsg} />}

      <Text style={styles.label}>Name</Text>
      <Dropdown label={'Select Name'} dataType="care" onSelect={handleSelectName} initial={name} />
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

      <Text style={styles.label}>Pets</Text>
      <MultiselectDropdown label={'Select Pets'} dataType='petNames' onSelect={handleSelectPets} initials={initialPetNames} />

      <View style={[styles.labelCon]}>
          <Text style={styles.rowText}>Repeat</Text>
          <ToggleButton onPress={() => setRepeat(!repeat)} initial={repeat} size='small' />
        </View>

      <View style={styles.labelCon}>
        <Text style={styles.rowText}>Date(s)</Text>
        {repeat &&
          <View style={{ ...Spacing.flexRow }}>
            <Text style={styles.rowText}>End</Text>
            <CheckboxButton onPress={() => setEnding(!ending)} initial={ending} />
          </View>
        }
      </View>
      <View style={styles.rowCon}>
        <View style={(!repeat || !ending) && { width: 300, alignItems: 'center' }}>
          <RNDateTimePicker themeVariant="light" value={new Date(date)} minimumDate={new Date(date)} onChange={(event, selectedDate) => { setDate(selectedDate) }} accentColor={Colors.pink.dark} />
        </View>
        { repeat && ending &&
          <>
            <Text style={{ marginLeft: 15 }}> - </Text>
            <RNDateTimePicker themeVariant='light' value={new Date(endDate) ?? new Date()} minimumDate={new Date(date)} onChange={(event, selectedDate) => { setEndDate(selectedDate) }} accentColor={Colors.pink.dark} />
          </>
        }
      </View>

      
      {repeat && <View style={styles.labelCon}>
        <Text>Frequency</Text>
        <Text>Times</Text>
      </View>}
      
      {repeat &&
        <View style={styles.rowCon}>
          <Dropdown label={'Select Frequency'} dataType="frequency" onSelect={setFrequency} initial={frequency} width={195} />
          
          <TextInput 
            style={[styles.input, { width: 100, textAlign: 'right' }]} 
            placeholder='Times' 
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => setTimes(Number(text))} 
            value={(times ?? '').toString()} 
            keyboardType="numeric"
          />
        </View>
      }
      
      <View style={styles.bottomCon}>
        <ColorPickingPanel onPress={setColor} initial={initialValues?.color} />
        <MainButton onPress={handleSubmit} title={status === 'pending' ? 'Submitting...' : initialValues?.name ? 'Save' : 'Create'} top={30} bottom={10} />
        <SubButton onPress={() => navigation.goBack()} title='Cancel' top={10} bottom={10} />
      </View>

    </ScrollView>
  )
}
 
export default CareForm