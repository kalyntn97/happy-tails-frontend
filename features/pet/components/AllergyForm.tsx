import { useNavigation } from '@react-navigation/native'
import Fuse from 'fuse.js'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
//utils & types
import { Health } from '@health/HealthInterface'
import { ALLERGIES } from '@pet/petHelpers'
import { HealthCondition, Medication } from '@pet/PetInterface'
import { Stat } from '@stat/statInterface'
//hooks
import useForm from '@hooks/useForm'
//components
import TagPicker from '@components/Pickers/TagPicker'
import Dropdown from '@components/Dropdown/Dropdown'
import { Header } from '@navigation/NavigationStyles'
import { FormInput, FormLabel, getHeaderActions, Icon, ScrollScreen, TableForm } from '@components/UIComponents'
//styles
import { styles } from '@styles/stylesheets/FormStyles'

type Props = {
  initialValues: HealthCondition
  onSubmit: (type: 'allergy', formData: AllergyFormData) => void
  isPending: boolean
}

type AllergyFormData = {
  name: string
  type: string
  //* timeline = '? - now'
  description: string[]
  //* status = 'Chronic'
  pet: string
  medications: string[] | Medication[]
  stats: string[] | Stat[]
  vetVisits: string[] | Health[]
  conditionId: string
}

interface InitialState extends AllergyFormData { 
  errors: any 
  icon: string
}

const fuse = new Fuse(ALLERGIES, { keys: ['title', 'icon'] })

const AllergyForm = ({ initialValues, onSubmit, isPending }: Props) => {
  const initialState: InitialState = {
    name: initialValues?.name ?? null,
    type: initialValues?.type ?? 'Allergy',
    description: initialValues?.description ?? [],
    pet: initialValues?.pet ?? null,
    medications: initialValues?.medications ?? [],
    stats: initialValues?.stats ?? [],
    vetVisits: initialValues?.vetVisits ?? [],
    conditionId: initialValues?.conditionId ?? null,
    errors: {},
    icon: initialValues ? fuse.search(initialValues.name)[0]?.item.icon : 'allergy',
  }

  const navigation = useNavigation()

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, type, description, pet, medications, stats, vetVisits, conditionId, errors, icon }: InitialState = values

  const onChangeType = (input: string) => {
    onChange('icon', input)
    onChange('type', input)
  }

  const handleChange = (input: string) => {
    let joinedName = input
    if (!input.toLowerCase().includes('allergy')) joinedName += ' Allergy'
    onChange('name', joinedName)
    const search = fuse.search(input)
    if (search.length) {
      onChangeType(search[0].item.icon)
    }
  }

  function handleSubmit() {
    onSubmit('allergy', { name, type, description, pet, medications, stats, vetVisits, conditionId })
  }

  function handleValidate() {
    onValidate({ name })
  }

  const headerActions = getHeaderActions(onReset, isPending, handleValidate)

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' />
    })
  }, [headerActions])

  const table = [
    { key: 'Type', icon: 'tag', label: 'Type', value: 
      <Dropdown initial={type} dataType='allergyTypes' withBorder={false} width={65} onSelect={(selected: string) => onChangeType(selected)} />
    },
  ]

  return (
    <ScrollScreen props={{ keyboardShouldPersistTaps: 'handled' }}>
      <View style={[styles.headerCon, { zIndex: 0 }]}>
        { icon ? <Icon type='pet' name={icon} size='large' /> : <ActivityIndicator /> }
        <View style={styles.titleCon}>
          <FormInput initial={name} placeholder="New Allergy" onChange={(text: string) => handleChange(text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} width='100%' bottom={0} />
        </View>
      </View>
      
      <TableForm table={table} size='small' withTitle={true} />

      <FormLabel label='Symptoms' icon='allergy' />
      <TagPicker tags={description} onSelect={(values: string[]) => onChange('description', values)} />
      
    </ScrollScreen>
  )
}

export default AllergyForm
