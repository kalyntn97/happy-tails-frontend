import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { CircleIcon, ErrorMessage } from '@components/UIComponents'
import { CheckboxButton, MainButton, ToggleButton, TransparentButton } from '@components/ButtonComponent'
//helpers & types
import { Medication, MedicationFormData } from '@pet/PetInterface'
import { getCareIconSource, getPetIconSource } from '@utils/ui'
//styles
import { styles } from '@styles/FormStyles'
import { Colors, Forms, Spacing, Typography } from '@styles/index'
import useForm from '@hooks/useForm'
import { MED_STATUS } from '@pet/petHelpers'

interface MedicationFormProps {
  initialValues?: MedicationFormData
  onSubmit: (type: string, medFormData: MedicationFormData) => void
}

const MedicationForm :FC<MedicationFormProps>= ({ initialValues, onSubmit }) => {
  const initialState = { name: initialValues?.name ?? null, amount: initialValues?.dosage.amount ?? null, times: initialValues?.dosage.times ?? null, frequency: initialValues?.dosage.frequency ?? 'Daily', startDate: initialValues?.dosage.startDate ?? new Date(), ending: !!initialValues?.dosage.endDate ?? false, endDate: initialValues?.dosage.endDate ?? new Date(), medReminder: !!initialValues?.dosage.reminder ?? false, refillTimes: initialValues?.refill?.times ?? null, refillFrequency: initialValues?.refill?.frequency ?? 'Monthly', refillReminder: !!initialValues?.refill.reminder ?? false, status: initialValues?.status ?? 'Active', errorMsg: false }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, amount, times, frequency, startDate, ending, endDate, medReminder, refillTimes, refillFrequency, refillReminder, status, errorMsg } = values
  const dosage = status !== 'Inactive' ? { amount, times, frequency, startDate, endDate: ending ? endDate : null, reminder: medReminder } : null
  const refill = status !== 'Inactive' && refillReminder ? { times: refillTimes, frequency: refillFrequency, reminder: refillReminder } : null
  // const [name, setName] = useState<string>(initialValues?.name ?? null)
  // const [amount, setAmount] = useState<string>(initialValues?.dosage.amount ?? null)
  // const [times, setTimes] = useState<number>(initialValues?.dosage.times ?? null)
  // const [frequency, setFrequency] = useState<string>(initialValues?.dosage.frequency ?? 'Daily')
  // const [startDate, setStartDate] = useState<string>(initialValues?.dosage.startDate ?? null)
  // const [ending, setEnding] = useState<boolean>(!!initialValues?.dosage.endDate ?? false)
  // const [endDate, setEndDate] = useState<string>(initialValues?.dosage.endDate ?? null)
  // const [medReminder, setMedReminder] = useState<boolean>(initialValues?.dosage.reminder ? true : false)
  // const [refillReminder, setRefillReminder] = useState<boolean>(!!initialValues?.refill ? true : false)
  // const [refillTimes, setRefillTimes] = useState<number>(initialValues?.refill?.times ?? null)
  // const [refillFrequency, setRefillFrequency] = useState<string>(initialValues?.refill?.frequency ?? 'Monthly')
  // const [status, setStatus] = useState<string>(initialValues?.status ?? 'Active')
  // const [errorMsg, setErrorMsg] = useState<string>(null)

  function handleSubmit() {
    console.log('med', { name, dosage, refill, status })
    // onSubmit('med', { name, dosage, refill, status })
  }

  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getCareIconSource('med')}/>
      <Text style={styles.label}>Medication name</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter name'
        placeholderTextColor={Colors.shadow.reg}
        value={name}
        onChangeText={(text: string) => onChange('name', text)}
      />
      <View style={styles.labelCon}>
        {status !== 'Inactive' && <Text>Medication amount</Text>}
        <Text>Status</Text>
      </View>
      <View style={styles.rowCon}>  
        {status !== 'Inactive' && <TextInput 
          style={[styles.input, { width: 195  }]}
          placeholder='Enter amount'
          placeholderTextColor={Colors.shadow.reg}
          value={amount}
          onChangeText={(text: string) => onChange('amount', text)}
        />}
        <Dropdown dataType='medStatus' initial={status} onSelect={selected => onChange('status', selected)} width={status === 'Inactive' ? 300 : 100} />
      </View>
      {status !== 'Inactive' && <>
      
        <View style={styles.labelCon}>
          <Text style={styles.rowText}>Start date</Text>
          <View style={{ ...Spacing.flexRow }}>
            <Text style={styles.rowText}>End date</Text>
            <CheckboxButton onPress={() => onChange('ending', !ending)} initial={ending} />
          </View>
          
        </View>
        <View style={styles.rowCon}>
          <View style={(!ending) && { width: 300, alignItems: 'center' }}>
            <RNDateTimePicker themeVariant="light" value={new Date(startDate)} onChange={(event, selectedDate) => { onChange('startDate', selectedDate) }} accentColor={Colors.pink.dark} />
          </View>
          { ending &&
            <>
              <Text style={{ marginLeft: 10 }}> - </Text>
              <RNDateTimePicker themeVariant='light' value={new Date(endDate)} minimumDate={new Date(endDate)} onChange={(event, selectedDate) => { onChange('endDate', selectedDate) }} accentColor={Colors.pink.dark} />
            </>
          }
        </View>

        <Text style={styles.label}>Medication frequency</Text>
        <View style={styles.rowCon}>
          <TextInput
            style={[Forms.inputBase, styles.leftInput, { marginRight: 5 }]}
            placeholder='Enter times'
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => onChange('times', Number(text))} 
            value={(times ?? '').toString()} 
            keyboardType="numeric"
          />
          <Dropdown label='...' dataType="frequency" onSelect={selected => onChange('frequency', selected)} width={styles.rightInput.width} initial={frequency} />
        </View>
        
        <View style={styles.labelCon}>
          <Text>Medication reminder</Text>
          <ToggleButton initial={medReminder} onPress={() =>  onChange('medReminder', !medReminder)} size='small' />
        </View>

        <View style={styles.labelCon}>
          <Text>Refill reminder</Text>
          <ToggleButton initial={refillReminder} onPress={() => onChange('refillReminder', !refillReminder)} size='small' />
        </View>
        {refillReminder && <>
          <Text style={styles.label}>Refill frequency</Text>
          <View style={styles.rowCon}>
            <TextInput
              style={[Forms.inputBase, styles.leftInput, { marginRight: 5 }]}
              placeholder='Enter times'
              placeholderTextColor={Colors.shadow.reg}
              onChangeText={(text: string) => onChange('refillTimes', Number(text))} 
              value={(refillTimes ?? '').toString()} 
              keyboardType="numeric"
            />
            <Dropdown label='...' dataType="frequency" onSelect={selected => onChange('refillFrequency', selected)} width={styles.rightInput.width} initial={refillFrequency} />
          </View>
        </>}
      </>}
      
      {errorMsg && <ErrorMessage error={errorMsg} top={20} />}
      <View style={[styles.btnCon, { marginTop: errorMsg ? 0 : 40 }]}>
        <MainButton title='Submit' size='small' onPress={() => status !== 'Inactive' ? onValidate(name, dosage, status) : onValidate(name, status)} />
        <TransparentButton title='Cancel' size='small' onPress={onReset} />
      </View>

    </View>
  )
}

export default MedicationForm