import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
//components
import Dropdown from '@components/Dropdown/Dropdown'
//styles
import { styles } from '@styles/FormStyles'
import { Colors, Forms, Spacing } from '@styles/index'
import { ToggleButton } from '@components/ButtonComponent'

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
    <View style={styles.container}>
      <Text style={styles.label}>Medication name</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter name'
        placeholderTextColor={Colors.shadow.reg}
        value={name}
        onChangeText={(text: string) => setName(text)}
      />
      <Text style={styles.label}>Medication amount</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter amount'
        placeholderTextColor={Colors.shadow.reg}
        value={amount}
        onChangeText={(text: string) => setAmount(text)}
      />
      <Text style={styles.label}>Frequency</Text>
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
        <Text>Reminder</Text>
        <ToggleButton initial={reminder} onPress={() => setReminder(!reminder)} />
      </View>


      

    </View>
  )
}

export default MedicationForm