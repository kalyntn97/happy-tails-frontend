import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackScreenNavigationProp } from '@navigation/types'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { DateInput, FormHeader, FormInput, Icon, InlinePicker, ModalInput, NoteInput, ScrollScreen, TableForm, TitleLabel } from '@components/UIComponents'
import { Header } from '@navigation/NavigationStyles'
//helpers
import { HealthConditionFormData, Timeline } from '@pet/PetInterface'
import { HEALTH_CONDITION_STATUS } from '@pet/petHelpers'
//hooks
import useForm from '@hooks/useForm'
//styles
import { Spacing, Typography, UI } from '@styles/index'
import { styles } from '@styles/stylesheets/FormStyles'
import ScrollSelector from '@components/ScrollSelector'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { ActionButton, MainButton, ToggleButton } from '@components/ButtonComponents'

interface HealthConditionFormProps {
  initialValues?: HealthConditionFormData
  onSubmit: (type: 'condition', formData: HealthConditionFormData) => void
  isPending: boolean
}

interface InitialState extends HealthConditionFormData {
  conditionId: string | null
  errors: { [key: string]: string }
}

const TimelinePicker = ({ t, onSelect }: { t: Timeline, onSelect: (t: Timeline) => void }) => {
  const { startDate, endDate, notes } = t
  
  const table = [
    { key: 'start', icon: 'due', label: 'Start date', value: 
      <DateInput date={startDate} onChangeDate={(selected: string) => onSelect({ ...t, startDate: selected })} header='Start date' />
    },
    { key: 'end', icon: 'due', label: 'End date', value:

      <ModalInput label={!!endDate ? new Date(endDate).toLocaleDateString() : 'Not Specified.'}>
        <View style={UI.rowContent()}>
          <FormHeader title={`End date${!!endDate ? `: ${new Date(endDate).toLocaleDateString()}` : ''}`} /> 
          <ToggleButton isOn={!!endDate} onPress={() => onSelect({ ...t, endDate: !!endDate ? null : new Date().toISOString() })} />
        </View>

        { !!endDate && <RNDateTimePicker display='inline' themeVariant='light' value={endDate ? new Date(endDate) : new Date()} onChange={(_, selectedDate) => onSelect({ ...t, endDate: selectedDate.toISOString() })} minimumDate={new Date()} /> }
      </ModalInput>
    },
    { key: 'notes', icon: 'note', label: 'Notes', value: 
      <NoteInput notes={notes} onChange={(text: string) => onSelect({ ...t, notes: text })} />
    },
  ]

  return (
    <TableForm table={table} />
  )
}

const TimelineManager = ({ timeline, onChange }: { timeline: Timeline[], onChange: (timeline: Timeline[]) => void }) => (
  <View style={styles.contentCon}>
    { timeline.length ? timeline.map((t, index) => {
      const startDateLabel = new Date(t.startDate).toLocaleDateString()
      const endDateLabel = t.endDate ? new Date(t.endDate).toLocaleDateString() : '?'

      return (
        <View key={index} style={[Spacing.flexRowStretch, { marginVertical: 15, alignItems: 'flex-start' }]}>
          <ActionButton icon='decrease' size='xSmall' onPress={() => onChange(timeline.filter((t, i) => i !== index))} buttonStyles={{ marginRight: 15 }} />
          <ModalInput buttonStyles={{ flex: 1 }} customLabel={
            <View style={[Spacing.flexColumn, { alignItems: 'flex-start' }]}>
              <Text style={Typography.regBody}>{startDateLabel} - {endDateLabel}</Text> 
              <Text style={Typography.subBody}> • {t.notes ?? 'No notes added.'}</Text>
            </View>
          }>
            <TimelinePicker t={t} onSelect={(selected: Timeline) => onChange(timeline.map((t, i) => i === index ? { ...t, ...selected } : t))} />
          </ModalInput> 
        </View>
      )
    }) : <Text style={Typography.subBody}>No timeline added.</Text> }
    <MainButton title='Add timeline' onPress={() => onChange([...timeline, { startDate: timeline.length && !!timeline[timeline.length - 1].endDate ? timeline[timeline.length - 1].endDate : new Date().toISOString(), endDate: null, notes: null }])} disabled={timeline.length && !timeline[timeline.length - 1].endDate} size='xSmall' buttonStyles={{ marginVertical: 20 }} />
  </View>
)

const HealthConditionForm = ({ initialValues, onSubmit, isPending }: HealthConditionFormProps) => {
  const initialState: InitialState = { 
    name: initialValues?.name ?? null, 
    type: initialValues?.type ?? null, 
    status: initialValues?.status ?? HEALTH_CONDITION_STATUS[0],
    timeline: initialValues?.timeline ?? [], 
    description: initialValues?.description ?? null,
    conditionId: initialValues?.conditionId ?? null,
    errors: null,
  }

  const { values, onChange, onReset, onValidate } = useForm(handleSubmit, initialState)
  const { name, type, timeline, description, status, conditionId, errors }: InitialState = values

  const navigation = useNavigation<StackScreenNavigationProp>()

  function handleSubmit() {
    onSubmit('condition', { name, type, timeline, description, status, conditionId })
  }

  function handleValidate() {
    onValidate({ name, type, })
  }

  const table = [
    { key: 'type', icon: 'tag', label: 'Type', value:
      <Dropdown label='Select type' dataType='conditionTypes' initial={type} onSelect={selected => onChange('type', selected)} withBorder={false} buttonStyles={{ height: 20 }} align='right' error={errors?.type} width={95} contentWidth={50} /> 
    },
    { key: 'description', icon: 'note', label: 'Description', value: 
      <NoteInput notes={description} onChange={(text: string) => onChange('description', text)} /> 
    },
    { key: 'status', icon: 'check', label: 'Status', value: 
      <InlinePicker selected={status} options={HEALTH_CONDITION_STATUS} onSelect={(selected: string) => onChange('status', selected)} />
    },
  ]

  const headerActions = [
    { icon: 'reset', onPress: onReset },
    { title: isPending ? 
      <Text style={Spacing.flexRow}><ActivityIndicator /> Submitting...</Text>
      : 'Submit', onPress: handleValidate },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' />
    })
  }, [headerActions])

  return (
    <ScrollScreen props={{ keyboardShouldPersistTaps: 'never' }}>
      <View style={styles.headerCon}>
        <Icon type='pet' name='condition' size='large' />
        <View style={styles.titleCon}>
          <FormInput initial={initialState.name} placeholder="Health Condition Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={100} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} width='100%' bottom={0} />
        </View>
      </View>

      <TableForm table={table} size='small' />

      <TitleLabel title='Timeline' iconName='due' mode='bold' containerStyles={{ marginTop: 20 }}/>
      <TimelineManager timeline={timeline} onChange={(values: Timeline[]) => onChange('timeline', values)} />

    </ScrollScreen>
  )
}

export default HealthConditionForm