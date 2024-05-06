import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { CircleIcon } from '@components/UIComponents'
import { CheckboxButton, MainButton, TransparentButton } from '@components/ButtonComponent'
//helpers
import { getPetIconSource } from '@utils/ui'
import { Disease, Timeline } from '@pet/PetInterface'
//styles
import { styles } from '@styles/FormStyles'
import { Colors, Spacing, Typography } from '@styles/index'

interface DiseaseFormProps {
  initialValues?: { name: string, type: string, description: string, timeline: Timeline[], status: string }
  onSave: (diseaseFormData: Disease) => void
}

const DiseaseForm: FC<DiseaseFormProps> = ({ initialValues, onSave }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [type, setType] = useState<string>(initialValues?.type ?? null)
  const [description, setDescription] = useState(initialValues?.description ?? null)
  const [ending, setEnding] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date>(null)
  const [endDate, setEndDate] = useState<Date>(null)
  const [status, setStatus] = useState(initialValues?.status ?? null)
  const [errorMsg, setErrorMsg] = useState<string>(null)
  
  const handleSave = () => {
    if (!name || !type || startDate || status )  {
      setErrorMsg('Please enter all required fields') 
    } else {
      setErrorMsg(null)
      const timeline = [{ startDate: startDate, endDate: endDate }]
      onSave({ name, type, description, timeline, status })
    }
  }
  
  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getPetIconSource('disease')}/>
      <Text style={{ ...Typography.errorMsg }}>{errorMsg}</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter name'
        placeholderTextColor={Colors.shadow.reg}
        value={name}
        onChangeText={(text: string) => setName(text)}
      />
      <View style={styles.labelCon}>
        <Text>Type</Text>
        <Text>Status</Text>
      </View>
      <View style={styles.rowCon}>
        <Dropdown label='Select Type' dataType='diseaseTypes' onSelect={setType} width={195} />
        <Dropdown label='Status' dataType='diseaseStatus' onSelect={setStatus} width={100} />
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter description'
        placeholderTextColor={Colors.shadow.reg}
        value={description}
        onChangeText={(text: string) => setDescription(text)}
      />
      <View style={styles.labelCon}>
        <Text>Start date</Text>
        <View style={{ ...Spacing.flexRow }}>
          <Text>End date</Text>
          <CheckboxButton initial={ending} onPress={() => setEnding(!ending)}/>
        </View>
      </View>
      <View style={styles.rowCon}>
        <View style={!ending && { width: '100%', alignItems: "center" }}>
          <RNDateTimePicker themeVariant='light' value={new Date()} minimumDate={new Date()} onChange={(event, selectedDate) => { setStartDate(selectedDate) }} accentColor={Colors.pink.dark} />
        </View>
        {ending && 
          <RNDateTimePicker themeVariant='light' value={new Date()} minimumDate={new Date()} onChange={(event, selectedDate) => { setEndDate(selectedDate) }} accentColor={Colors.pink.dark} />
        }
      </View>

      <View style={styles.btnCon}>
        <MainButton title='Add' size='small' onPress={handleSave} />
        <TransparentButton title='Cancel' size='small' />
      </View>
      
    </View>
  )
}

export default DiseaseForm