import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { InputModeOptions, View } from 'react-native'
//helpers &  utils
import { useShallowPets } from '@hooks/sharedHooks'
import useForm from '@hooks/useForm'
import { ServiceFormData } from '@pet/PetInterface'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import PetPicker from '@components/Pickers/PetPicker'
import { FormError, FormHeader, FormInput, getHeaderActions, Icon, ModalInput, NoteInput, ScrollScreen, TableForm } from '@components/UIComponents'
import { Header } from '@navigation/NavigationStyles'
//styles
import { styles } from '@styles/stylesheets/FormStyles'
import MultipleInputs from '@components/MultipleInputs'
import { windowWidth } from '@utils/constants'

interface ServiceFormProps {
  initialValues?: ServiceFormData
  onSubmit: (type: 'service', formData: ServiceFormData) => void
  isPending: boolean
} 

interface InitialState extends ServiceFormData {
  errors: any
}

interface MultipleInputModalProps {
  initials: string[]
  label: string
  inputLabel: string
  onUpdate: (initials: string[]) => void
  inputMode?: InputModeOptions
}

const MultipleInputsModal = ({ label, initials, onUpdate, inputMode = 'text', inputLabel }: MultipleInputModalProps) => {
  return (
    <ModalInput label={label} height='93%'>
      <FormHeader title={`Update ${inputLabel}`} />
      <MultipleInputs
        initials={initials}
        type='text'
        inputMode={inputMode}
        inputName={inputLabel}
        onEdit={onUpdate}
        inputWidth={windowWidth * 0.7}
      />
    </ModalInput>
  )
}

const ServiceForm = ({ initialValues, onSubmit, isPending }: ServiceFormProps) => {
  const { PET_BASICS } = useShallowPets()

  const initialState: InitialState = { 
    name: initialValues?.name ?? null, 
    type: initialValues?.type ?? null, 
    addresses: initialValues?.addresses ?? [], 
    emails: initialValues?.emails ?? [], 
    phones: initialValues?.phones ?? [], 
    notes: initialValues?.notes ?? null,
    pets: initialValues?.pets ?? [PET_BASICS[0]._id],
    errors: {}
  }

  const navigation = useNavigation()

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, type, addresses, emails, phones, notes, pets, errors }: InitialState = values

  function handleSubmit() {
    onSubmit('service', { name, type, addresses, emails, phones, notes, pets })
  }

  function handleValidate() {
    onValidate({ name, type, phones })
  }
  
  const headerActions = getHeaderActions(onReset, isPending, handleValidate)

  const table = [
    { key: 'type', icon: 'service', value:
      <>
        <Dropdown label='Select type' dataType='serviceTypes' initial={type} onSelect={selected => onChange('type', selected)} width={50} withBorder={false} buttonTextStyles={{ textAlign: 'right' }} buttonStyles={{ height: 20 }} />
        <FormError errorKey='type' errors={errors} />
      </>
    },
    { key: 'addresses', icon: 'address', value: 
      <MultipleInputsModal initials={addresses} label={addresses.length > 0 ? 'Update addresses.' : 'No address added.'} inputLabel='Address' onUpdate={(addresses: string[]) => onChange('addresses', addresses)} />
    },
    { key: 'emails', icon: 'email', value:
      <MultipleInputsModal initials={emails} label={emails.length > 0 ? 'Update emails.' : 'No email added.'} inputLabel='Email' onUpdate={(emails: string[]) => onChange('emails', emails)} inputMode='email' />
    },
    { key: 'phones', icon: 'phone', value:
      <MultipleInputsModal initials={phones} label={phones.length > 0 ? 'Update phones.' : 'No phone added.'} inputLabel='Phone' onUpdate={(phones: string[]) => onChange('phones', phones)} inputMode='tel' />
    },
    { key: 'notes', icon: 'note', value: 
      <NoteInput notes={notes} onChange={(text: string) => onChange('notes', text)} />
    },
    { key: 'pets', label: 'Pets', icon: 'pet', value: 
      <PetPicker pets={pets} onSelect={(selected: string[]) => onChange('pets', selected)} mode='multi' /> 
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
        <Icon type='pet' name={type && type !== 'Other' ? type : 'service'} size='large' />
        <View style={styles.titleCon}>
          <FormInput initial={name} placeholder="New Service Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} width='100%' bottom={0} />
        </View>
      </View>

      <TableForm table={table} />
    </ScrollScreen>
  )
}

export default ServiceForm