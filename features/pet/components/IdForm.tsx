import React, { useEffect } from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { FormInput, Icon, NoteInput, ScrollScreen, TableForm } from '@components/UIComponents'
import { Header } from '@navigation/NavigationStyles'
//utils
import useForm from '@hooks/useForm'
import { IdFormData } from '@pet/PetInterface'
//styles
import { Spacing } from '@styles/index'

interface IdFormProps {
  initialValues?: IdFormData
  onSubmit: (type: 'ids', idFormData: IdFormData) => void
  isPending: boolean
}

interface InitialState extends IdFormData {
  errors: any
}

const IdForm = ({ initialValues, onSubmit, isPending }: IdFormProps) => {
  const initialState: InitialState = { 
    name: initialValues?.name ?? null, 
    type: initialValues?.type ?? null, 
    no: initialValues?.no ?? null, 
    notes: initialValues?.notes ?? null, 
    errors: {},
  }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)

  const { name, type, no , notes, errors }: InitialState = values

  const navigation = useNavigation()
  
  function handleSubmit() {
    onSubmit('ids', { name, type, no, notes })
  }

  function handleValidate() {
    onValidate({ type, no })
  }
  
  const table = [
    { key: 'type', icon: 'tag', value:
      <Dropdown label='Select type' dataType='petIds' initial={type} onSelect={selected => onChange('type', selected)} width={55} withBorder={false} buttonTextStyles={{ textAlign: 'right' }} error={errors?.type}
      />
    },
    { key: 'name', icon: 'ids', value: 
      <FormInput initial={name} onChange={(text: string) => onChange('name', text)} placeholder='Enter Registry Name' withBorder={false} align='right' /> 
    },
    { key: 'no', icon: 'no', value: 
      <FormInput initial={no} onChange={(text: string) => onChange('no', text)} placeholder='Enter no.'  withBorder={false} align='right' props={{ inputMode: 'numeric' }} maxLength={20} error={errors?.no}
      />
    },
    { key: 'notes', icon: 'note', value: 
      <NoteInput notes={notes} onChange={(text: string) => onChange('notes', text)} modalHeight={80} />
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
      <Icon type='pet' name={type && type !== 'Other' ? type : 'ids'} size='large' />

      <TableForm table={table} size='med' />
    </ScrollScreen>
  )
}

export default IdForm
