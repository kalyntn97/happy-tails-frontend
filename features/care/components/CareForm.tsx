//npm
import { useState } from "react"
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, useWindowDimensions, Pressable, Dimensions } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import { CheckboxButton, MainButton, SubButton, ToggleButton, TransparentButton } from "@components/ButtonComponent"
import { DateInput, ErrorMessage, FormInput, FormLabel, ModalCon } from "@components/UIComponents"
import ColorPicker from "@components/ColorPicker"
import PetPicker from "@components/PetPicker"
import TitleInput from "@components/TitleInput"
import FrequencyPicker from "@components/FrequencyPicker"
//types && hooks
import useForm from "@hooks/useForm"
import { PetBasic } from "@pet/PetInterface"
import type { Care, CareFormData } from "@care/CareInterface"

//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"


interface InitialState extends Care {
  ending: boolean
  errorMsg: string
}

interface CareFormProps {
  onSubmit: (formData: CareFormData) => void
  initialValues?: Care
  navigation: any
  status: string
  setColor?: (color: number) => void
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues, navigation, status, setColor }) => {
  const initialState: InitialState= {
    name: initialValues?.name ?? null, 
    pets: initialValues?.pets ?? [],
    repeat: initialValues?.repeat ?? false,
    startDate: initialValues?.startDate ?? new Date(),
    ending: !!initialValues?.endDate,
    endDate: initialValues?.endDate ?? null,
    frequency: initialValues?.frequency ?? null,
    color: initialValues?.color ?? 0,
    icon: initialValues?.icon ?? null,
    _id: initialValues?._id ?? null,
    errorMsg: '',
  }
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, pets, repeat, startDate, ending, endDate, frequency, color, icon, _id, errorMsg } = values
  const height = useWindowDimensions().height

  function handleSubmit() {
    if (!name || !pets.length) {
      onChange('errorMsg', 'Please enter all fields.')
    } else {
      onChange('errorMsg', '')

      if (!repeat) ['frequency', 'endDate'].map(value => onChange(value, null))
      
      if (!ending) onChange('endDate', null)
      onSubmit({ name, pets, repeat, startDate, endDate, frequency, color, _id })
    }
  }
  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.container, { minHeight: height * 0.75}]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      <View style={{ position: 'absolute', right: 0, top: 20, zIndex: 999 }}>
        <ColorPicker mode='modal' onPress={(selected) => {
          onChange('color', selected)
          setColor(selected)
      }} initial={color} />
      </View>
      <TitleInput initial={name} placeholder='New Task' onChange={(input) => onChange('name', input)} type='care' />
      <FormLabel label='Select Pets' icon="pets" width='100%' top={30} />
      
      <PetPicker mode="multi" onSelect={(selections) => onChange('pets', selections)} initials={pets?.map((pet: PetBasic) => pet._id ?? pet)} />

      <FormLabel label='Start Date' icon="schedule" width='100%' top={30} />
      <DateInput date={startDate} onChangeDate={selectedDate => onChange('startDate', selectedDate)} color={color} />

      <View style={[styles.labelCon]}>
          <FormLabel label='Repeat' icon="repeat" />
          <ToggleButton onPress={() => onChange('repeat', !repeat)} initial={repeat} size='small' />
      </View>
      
      {repeat &&
        <View style={Spacing.flexRow}>
          <Text style={styles.rowText}>End Date</Text>
          <CheckboxButton onPress={() => onChange('ending', !ending)} initial={ending} />
        </View>
      }
      { repeat && ending &&
        <>
          <Text style={{ marginLeft: 15 }}> - </Text>
          <RNDateTimePicker themeVariant='light' value={new Date(endDate) ?? new Date()} minimumDate={new Date()} onChange={(event, selectedDate) => { onChange('endDate', selectedDate) }} accentColor={Colors.multi.dark[color]} />
        </>
      }
      

      { repeat && <View style={{ width: '90%', marginTop: 20 }}><FrequencyPicker color={color}/></View> }

      <View style={styles.bottomCon}>
        {errorMsg && <ErrorMessage error={errorMsg} />}
        <View style={Spacing.flexRow}>
          <MainButton onPress={() => onValidate(name, pets.length, startDate)} title={status === 'pending' ? 'Submitting...' : !!name ? 'Save' : 'Create'} />
          <TransparentButton onPress={onReset} title='Clear' />
        </View>
      </View>

    </ScrollView>
  )
}

export default CareForm