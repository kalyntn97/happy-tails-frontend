import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { CircleIcon } from '@components/UIComponents'
import { CheckboxButton, MainButton, ToggleButton, TransparentButton } from '@components/ButtonComponent'
//helpers & types
import { Medication, MedicationFormData } from '@pet/PetInterface'
import { getCareIconSource, getPetIconSource } from '@utils/ui'
//styles
import { styles } from '@styles/FormStyles'
import { Colors, Forms, Spacing, Typography } from '@styles/index'

interface MedicationFormProps {
  initialValues?: { name: string, dosage: { amount: string, startDate: string, endDate: string, times: number, frequency: string, reminder: string }, refill: { times: number, frequency: string, reminder: string }, status: string },
  onSave: (medFormData: MedicationFormData) => void
}

const MedicationForm :FC<MedicationFormProps>= ({ initialValues, onSave }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [amount, setAmount] = useState<string>(initialValues?.dosage.amount ?? null)
  const [times, setTimes] = useState<number>(initialValues?.dosage.times ?? null)
  const [frequency, setFrequency] = useState<string>(initialValues?.dosage.frequency ?? 'Daily')
  const [ending, setEnding] = useState<boolean>(!!initialValues?.dosage.endDate ?? false)
  const [startDate, setStartDate] = useState<string>(initialValues?.dosage.startDate ?? null)
  const [endDate, setEndDate] = useState<string>(initialValues?.dosage.endDate ?? null)
  const [medReminder, setMedReminder] = useState<boolean>(initialValues?.dosage.reminder ? true : false)
  const [refillReminder, setRefillReminder] = useState<boolean>(!!initialValues?.refill ? true : false)
  const [refillTimes, setRefillTimes] = useState<number>(initialValues?.refill?.times ?? null)
  const [refillFrequency, setRefillFrequency] = useState<string>(initialValues?.refill?.frequency ?? 'Monthly')
  const [status, setStatus] = useState<string>(initialValues?.status ?? 'Active')
  const [errorMsg, setErrorMsg] = useState<string>(null)

  const handleSave = () => {
    if (!name || !amount || !startDate )  {
      setErrorMsg('Please enter all required fields') 
    } else {
      setErrorMsg(null)
      const dosage = { amount, startDate, endDate, times, frequency, reminder: medReminder }
      const refill = { times, frequency, reminder: refillReminder }
      onSave({ name, dosage, refill, status })
    }
  }
  
  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getCareIconSource('med')}/>
      <Text style={{ ...Typography.errorMsg }}>{errorMsg}</Text>
      <Text style={styles.label}>Medication name</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter name'
        placeholderTextColor={Colors.shadow.reg}
        value={name}
        onChangeText={(text: string) => setName(text)}
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
          onChangeText={(text: string) => setAmount(text)}
        />}
        <Dropdown dataType='medStatus' initial={status} onSelect={setStatus} width={status === 'Inactive' ? 300 : 100} />
      </View>
      {status !== 'Inactive' && <>
      
        <View style={styles.labelCon}>
          <Text style={styles.rowText}>Start date</Text>
          <View style={{ ...Spacing.flexRow }}>
            <Text style={styles.rowText}>End date</Text>
            <CheckboxButton onPress={() => setEnding(!ending)} initial={ending} />
          </View>
          
        </View>
        <View style={styles.rowCon}>
          <View style={(!ending) && { width: 300, alignItems: 'center' }}>
            <RNDateTimePicker themeVariant="light" value={date ? new Date(date) : new Date()} minimumDate={new Date(date)} onChange={(event, selectedDate) => { setDate(selectedDate.toISOString()) }} accentColor={Colors.pink.dark} />
          </View>
          { ending &&
            <>
              <Text style={{ marginLeft: 10 }}> - </Text>
              <RNDateTimePicker themeVariant='light' value={endDate ? new Date(endDate) : new Date()} minimumDate={new Date(date)} onChange={(event, selectedDate) => { setEndDate(selectedDate.toISOString()) }} accentColor={Colors.pink.dark} />
            </>
          }
        </View>

        <Text style={styles.label}>Medication frequency</Text>
        <View style={styles.rowCon}>
          <TextInput
            style={[Forms.inputBase, styles.leftInput, { marginRight: 5 }]}
            placeholder='Enter times'
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => setTimes(Number(text))} 
            value={(times ?? '').toString()} 
            keyboardType="numeric"
          />
          <Dropdown label='...' dataType="frequency" onSelect={setFrequency} width={styles.rightInput.width} initial={frequency} />
        </View>
        
        <View style={styles.labelCon}>
          <Text>Medication reminder</Text>
          <ToggleButton initial={medReminder} onPress={() => setMedReminder(!medReminder)} size='small' />
        </View>

        <View style={styles.labelCon}>
          <Text>Refill reminder</Text>
          <ToggleButton initial={refillReminder} onPress={() => setRefillReminder(!refillReminder)} size='small' />
        </View>
        {refillReminder && <>
          <Text style={styles.label}>Refill frequency</Text>
          <View style={styles.rowCon}>
            <TextInput
              style={[Forms.inputBase, styles.leftInput, { marginRight: 5 }]}
              placeholder='Enter times'
              placeholderTextColor={Colors.shadow.reg}
              onChangeText={(text: string) => setRefillTimes(Number(text))} 
              value={(refillTimes ?? '').toString()} 
              keyboardType="numeric"
            />
            <Dropdown label='...' dataType="frequency" onSelect={setRefillFrequency} width={styles.rightInput.width} initial={refillFrequency} />
          </View>
        </>}
      </>}
      
      <View style={styles.btnCon}>
        <MainButton title='Add' size='small' onPress={handleSave} />
        <TransparentButton title='Cancel' size='small' />
      </View>

    </View>
  )
}

export default MedicationForm