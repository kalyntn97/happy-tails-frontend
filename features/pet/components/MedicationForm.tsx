import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Colors, Forms, Spacing } from '@styles/index'
import Dropdown from '@components/Dropdown/Dropdown'

interface MedicationFormProps {
  initialValues?: { name: string, amount: string, times: number, frequency: string, repeat: boolean, ending: boolean, startDate: string, endDate?: string, refill?: { times: number, frequency: string, dates?: string[] }, status: string, reminder: boolean }
}

const MedicationForm :FC<MedicationFormProps>= ({ initialValues }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [amount, setAmount] = useState<string>(initialValues?.amount ?? null)
  const [times, setTimes] = useState<number>(initialValues?.times ?? null)
  const [frequency, setFrequency] = useState<string>(initialValues?.frequency ?? 'Daily')
  const [repeat, setRepeat] = useState<boolean>(initialValues?.repeat ?? false)
  const [ending, setEnding] = useState<boolean>(initialValues?.ending ?? false)
  const [startDate, setStartDate] = useState<string>(initialValues?.startDate ?? null)
  const [endDate, setEndDate] = useState<string>(initialValues?.endDate ?? null)
  const [refillTimes, setRefillTimes] = useState<number>(initialValues?.refill.times ?? null)
  const [refillFrequency, setRefillFrequency] = useState<string>(initialValues?.refill.frequency ?? null)
  const [refillDates, setRefillDates] = useState<string[]>(initialValues?.refill.dates ?? null)
  const [status, setStatus] = useState<string>(initialValues?.status ?? null)
  const [reminder, setReminder] = useState<boolean>(initialValues?.reminder ?? true)
  
  return (
    <View>
      <TextInput 
        style={[styles.input, styles.fullInput]}
        placeholder='Enter medication name'
        placeholderTextColor={Colors.shadow.reg}
        value={name}
        onChangeText={(text: string) => setName(text)}
      />
      <TextInput 
        style={[styles.input, styles.fullInput]}
        placeholder='Enter medication amount'
        placeholderTextColor={Colors.shadow.reg}
        value={amount}
        onChangeText={(text: string) => setAmount(text)}
      />
      <View style={{ ...Spacing.flexRow }}>
        <Text style={styles.label}>Given every</Text>
        <TextInput
          style={[Forms.inputBase, { width: 50 }]}
          placeholder='1'
          placeholderTextColor={Colors.shadow.reg}
          onChangeText={(text: string) => setTimes(Number(text))} 
          value={(times ?? '').toString()} 
          keyboardType="numeric"
        />
        <Dropdown label='...' dataType="frequency" onSelect={setFrequency} width={120} initial={frequency} />
      </View>

      

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    width: '90%',
  },
  input: {
    ...Forms.input,
    margin: 5,
  },
  fullInput: {
    width: 320,
  },
    leftInput: {
    width: 140,
  },
    rightInput: {
    width: 170,
  },
})

export default MedicationForm