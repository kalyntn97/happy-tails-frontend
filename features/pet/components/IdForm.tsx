import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View } from 'react-native'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { FormInput, getHeaderActions, Icon, NoteInput, ScrollScreen, TableForm } from '@components/UIComponents'
import { Header } from '@navigation/NavigationStyles'
//utils
import useForm from '@hooks/useForm'
import { IdFormData } from '@pet/PetInterface'
//styles
import { styles } from '@styles/stylesheets/FormStyles'

interface IdFormProps {
  initialValues?: IdFormData
  onSubmit: (type: 'id', idFormData: IdFormData) => void
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
    onSubmit('id', { name, type, no, notes })
  }

  function handleValidate() {
    onValidate({ type, no })
  }

  const headerActions = getHeaderActions(onReset, isPending, handleValidate)

  const table = [
    { key: 'type', icon: 'tag', value:
      <Dropdown label='Select type' dataType='petIds' initial={type} onSelect={selected => onChange('type', selected)} width={55} withBorder={false} buttonStyles={{ height: 20 }} buttonTextStyles={{ textAlign: 'right' }} contentWidth={40} error={errors?.type}
      />
    },
    { key: 'name', icon: 'id', value: 
      <FormInput initial={name} onChange={(text: string) => onChange('name', text)} placeholder='Enter Registry Name' withBorder={false} align='right' /> 
    },
    { key: 'notes', icon: 'note', value: 
      <NoteInput notes={notes} initial={initialValues?.notes} onChange={(text: string) => onChange('notes', text)} />
    },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' />
    })
  }, [headerActions])

  return (
    <ScrollScreen props={{ keyboardShouldPersistTaps: 'never' }}>
      <View style={styles.headerCon}>
        <Icon type='pet' name={type && type !== 'Other' ? type : 'id'} size='large' />
        <View style={styles.titleCon}>
          <FormInput initial={no} placeholder="New Identification No" onChange={(text: string) => onChange('no', text)} styles={styles.title} maxLength={20} props={{ selectTextOnFocus: true, keyboardType: 'numbers-and-punctuation' }} error={errors?.no} withBorder={false} width='100%' bottom={0} />
        </View>
      </View>

      <TableForm table={table} />
    </ScrollScreen>
  )
}

export default IdForm
