import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { CircleIcon, ErrorMessage } from '@components/UIComponents'
import { MainButton, TransparentButton } from '@components/ButtonComponent'
import MultipleInputs from '@components/MultipleInputs'
//helpers
import { getPetIconSource } from '@utils/ui'
import { IllnessFormData, Timeline } from '@pet/PetInterface'
//hooks
import useForm from '@hooks/useForm'
//styles
import { styles } from '@styles/FormStyles'
import { Colors, Spacing } from '@styles/index'

interface IllnessFormProps {
  initialValues?: IllnessFormData
  onSubmit: (type: string, formData: IllnessFormData) => void
}

const IllnessForm: FC<IllnessFormProps> = ({ initialValues, onSubmit }) => {
  const initialState = { name: initialValues?.name ?? null, type: initialValues?.type ?? null, timeline: initialValues?.timeline ?? [], description: initialValues?.description ?? null, status: initialValues?.status ?? null, errorMsg: false }

  const [reset, setReset] = useState<boolean>(false)

  const { values, onChange, onReset, onValidate } = useForm(handleSubmit, initialState)
  const { name, type, timeline, description, status, errorMsg } = values

  const timelineInputs = timeline.map((t: Timeline) => Object.values(t)).flat()

  const handleSelectTimeline = (inputs: Date[]) => {
    const dates = []
    for (let i = 0; i < inputs.length; i += 2) {
      const startDate = inputs[i]
      const endDate = inputs[i + 1] ?? null
      dates.push({ startDate, endDate })
    }
    onChange('timeline', dates)
  }

  function handleSubmit() {
    onSubmit('illness', { name, type, timeline, description, status })
  }

  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getPetIconSource('illness')}/>
      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter name'
        placeholderTextColor={Colors.shadow.reg}
        value={name}
        onChangeText={(text: string) => onChange('name', text)}
      />
      <View style={styles.labelCon}>
        <Text>Type</Text>
        <Text>Status</Text>
      </View>
      <View style={styles.rowCon}>
        <Dropdown label='Select Type' dataType='illnessTypes' onSelect={selected => onChange('type', selected)} width={195} initial={type} />
        <Dropdown label='Status' dataType='illnessStatus' onSelect={selected => onChange('status', selected)} width={100} initial={status} />
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter description (optional)'
        placeholderTextColor={Colors.shadow.reg}
        value={description}
        onChangeText={(text: string) => onChange('description', text)}
      />
      <Text style={styles.label}>Timeline</Text>
      <View style={{ ...Spacing.flexRow, alignItems: 'flex-start' }}>
        <View style={{ ...Spacing.flexColumn}}>
          {timeline.map((_: string, index: number) =>
            <View key={index}>
              <Text style={{ height: 47, lineHeight: 47 }}>start</Text>
              <Text style={{ height: 47, lineHeight: 47 }}>end</Text>
            </View>
          )}
        </View>
        <MultipleInputs inputName='date' type='date' onEdit={handleSelectTimeline} width={150} initials={timelineInputs} />
      </View>

      {errorMsg && <ErrorMessage error={errorMsg} top={20} />}
      <View style={[styles.btnCon, { marginTop: errorMsg ? 0 : 40 }]}>
        <MainButton title='Submit' size='small' onPress={() => onValidate(name, type, status)} />
        <TransparentButton title='Clear' size='small' onPress={() => { onReset(); setReset(!reset) }} />
      </View>
      
    </View>
  )
}

export default IllnessForm