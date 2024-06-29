//npm
import { useState } from "react"
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, useWindowDimensions, Pressable } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import { CheckboxButton, MainButton, SubButton, ToggleButton, TransparentButton } from "@components/ButtonComponent"
import ColorPickingPanel from "@components/ColorPickingPanel"
import PetSelectForm from "@components/PetSelectForm"
import { ErrorMessage } from "@components/UIComponents"
//types
import { Pet, PetBasic } from "@pet/PetInterface"
import { CARES, careKeyFromName } from "@care/careHelpers"
import type { Care, CareFormData, CareFrequency, InitialCare } from "@care/CareInterface"

//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"
import useForm from "@hooks/useForm"

interface InitialState {
  name: string
  allowManualName: boolean,
  pets: string[] | Pet[]
  date: string
  repeat: boolean
  ending: boolean
  endDate: string
  frequency: CareFrequency
  times: number
  color: number
  careId: string
  errorMsg: string,
}

interface CareFormProps {
  onSubmit: (formData: CareFormData) => void
  initialValues?: InitialCare
  navigation: any
  status: string
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const initialState: InitialState= {
    name: initialValues?.name ?? null, 
    allowManualName: initialValues ? !CARES[initialValues?.name] : false,
    pets: initialValues?.pets ?? [],
    repeat: initialValues?.repeat ?? false,
    ending: initialValues ? !!initialValues.endDate : false,
    date: initialValues?.date ?? new Date().toISOString(),
    endDate: initialValues?.endDate ?? null,
    frequency: initialValues?.frequency ?? null,
    times: initialValues?.times ?? null,
    color: initialValues?.color ?? 0,
    careId: initialValues?._id ?? null,
    errorMsg: '',
  }
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, allowManualName, pets, repeat, ending, date, endDate, frequency, times, color, careId, errorMsg } = values
  const height = useWindowDimensions().height

  // handle input custom name for form
  const handleSelectName = (selected: string) => {
    if (selected === 'Others') {
      onChange('allowManualName', true)
      onChange('name', '')
    } else {
      onChange('allowManualName', false)
      const careKey = careKeyFromName[selected]
      onChange('name', careKey)
    }
  }

  function handleSubmit() {
    if (!name || !pets.length || !date) {
      onChange('errorMsg', 'Please enter all fields.')
    } else {
      onChange('errorMsg', '')

      if (!repeat) ['frequency', 'times', 'endDate'].map(value => onChange(value, null))
      
      if (!ending) onChange('endDate', null)
      onSubmit({ name, pets, repeat, date, endDate, frequency, times, color, careId })
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.container, { minHeight: height * 0.75}]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      <Text style={styles.label}>Name</Text>
      <Dropdown label={'Select Name'} dataType="care" onSelect={handleSelectName} initial={initialValues ? (CARES[name] ?? 'Others') : CARES[name]} />
      {allowManualName && 
        <TextInput 
          style={styles.input}
          placeholder="Specify name"
          placeholderTextColor={Colors.shadow.reg}
          onChangeText={(text: string) => onChange('name', text)}
          value={name}
          autoCapitalize="words"
        />
      }
 
      <Text style={styles.label}>Pets</Text>

      <PetSelectForm mode="multi" onSelect={(selections) => onChange('pets', selections)} initials={pets?.map((pet: PetBasic) => pet._id ?? pet)} />

      <View style={[styles.labelCon]}>
          <Text style={styles.rowText}>Repeat</Text>
          <ToggleButton onPress={() => onChange('repeat', !repeat)} initial={repeat} size='small' />
        </View>

      <View style={styles.labelCon}>
        <Text style={styles.rowText}>Date(s)</Text>
        {repeat &&
          <View style={{ ...Spacing.flexRow }}>
            <Text style={styles.rowText}>End</Text>
            <CheckboxButton onPress={() => onChange('ending', !ending)} initial={ending} />
          </View>
        }
      </View>
      <View style={styles.rowCon}>
        <View style={(!repeat || !ending) && { width: 300, alignItems: 'center' }}>
          <RNDateTimePicker themeVariant="light" value={new Date(date)} minimumDate={new Date(date)} onChange={(event, selectedDate) => { onChange('date', selectedDate) }} accentColor={Colors.pink.dark} />
        </View>
        { repeat && ending &&
          <>
            <Text style={{ marginLeft: 15 }}> - </Text>
            <RNDateTimePicker themeVariant='light' value={new Date(endDate) ?? new Date()} minimumDate={new Date(date)} onChange={(event, selectedDate) => { onChange('endDate', selectedDate) }} accentColor={Colors.pink.dark} />
          </>
        }
      </View>

      
      {repeat && <View style={styles.labelCon}>
        <Text>Frequency</Text>
        <Text>Times</Text>
      </View>}
      
      {repeat &&
        <View style={styles.rowCon}>
          <Dropdown label={'Select Frequency'} dataType="frequency" onSelect={(selected) => onChange('frequency', selected)} initial={frequency} width={195} />
          
          <TextInput 
            style={[styles.input, { width: 100, textAlign: 'right' }]} 
            placeholder='Times' 
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => onChange('times', Number(text))} 
            value={(times ?? '').toString()} 
            keyboardType="numeric"
          />
        </View>
      }
      <ColorPickingPanel onPress={(selected) => onChange('color', selected)} initial={color} />

      <View style={styles.bottomCon}>
        {errorMsg && <ErrorMessage error={errorMsg} />}
        <View style={{ ...Spacing.flexRow }}>
          <MainButton onPress={() => onValidate(name, pets.length, date)} title={status === 'pending' ? 'Submitting...' : !!name ? 'Save' : 'Create'} />
          <TransparentButton onPress={onReset} title='Clear' />
        </View>
      </View>

    </ScrollView>
  )
}

export default CareForm