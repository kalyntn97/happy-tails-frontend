import { useCallback, useEffect } from "react"
import { ScrollView, Text, View } from "react-native"
//components
import PetInfo from "@components/PetInfo/PetInfo"
import ColorPicker from "@components/Pickers/ColorPicker"
import FrequencyPicker, { frequencyMap, intervalLabel } from "@components/Pickers/FrequencyPicker"
import PetPicker from "@components/Pickers/PetPicker"
import TitleInput from "@components/TitleInput"
import { ToggleButton } from "@components/ButtonComponents"
import { DateInput, ModalInput, TableForm } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
//types && hooks
import { PetBasic } from "@pet/PetInterface"
import type { Care, CareFormData } from "@care/CareInterface"
import { useShallowPets } from "@hooks/sharedHooks"
import useForm from "@hooks/useForm"
//styles
import { Colors } from '@styles/index'
import { styles } from "@styles/stylesheets/FormStyles"


interface InitialState extends Care {
  ending: boolean
  errors: any
}

interface CareFormProps {
  onSubmit: (formData: CareFormData) => void
  initialValues?: Care
  navigation: any
  status: string
  setColor?: (color: number) => void
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues, navigation, status, setColor }) => {
  const { PET_BASICS, petIdToPet } = useShallowPets()
  const initialState: InitialState = {
    name: initialValues?.name ?? null, 
    pets: initialValues?.pets ?? [PET_BASICS[0]._id],
    repeat: initialValues?.repeat ?? false,
    startDate: initialValues?.startDate ?? new Date(),
    ending: !!initialValues?.endDate,
    endDate: initialValues?.endDate ?? null,
    frequency: initialValues?.frequency ?? { type: 'days', interval: 1, timesPerInterval: [1] },
    color: initialValues?.color ?? 0,
    icon: initialValues?.icon ?? null,
    _id: initialValues?._id ?? null,
    errors: null,
  }
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, pets, repeat, startDate, ending, endDate, frequency, color, _id, errors } = values

  function handleSubmit() {
    if (!repeat) ['frequency', 'endDate'].map(key => onChange(key, null))
    if (!ending) onChange('endDate', null)

    onSubmit({ name, pets, repeat, startDate, endDate, frequency, color, _id })
  }

  const handleValidate = useCallback(() => {
    return onValidate({ name })
  }, [name])

  const renderPets = (
    <ModalInput customLabel={
      pets.map((pet, index) =>
        <View key={pet} style={{ zIndex: index, marginLeft: -10 }}>
          <PetInfo pet={petIdToPet(pet)} size="small" />
        </View>
      )
    }>
      <PetPicker mode="multi" onSelect={(selections: string[]) => onChange('pets', selections)} initials={pets.map((pet: PetBasic) => pet._id ?? pet)} />
    </ModalInput>
  )

  const renderStartDate = (
    <DateInput date={startDate} onChangeDate={(selected) => onChange('startDate', selected )} color={color} />
  )

  const renderRepeat = (
    <ToggleButton onPress={() => onChange('repeat', !repeat)} isChecked={repeat} />
  )

  const renderFrequency = (
    <ModalInput maxHeight='90%'
      label={
        <Text style={{ maxWidth: '60%' }}>Repeats {frequency && frequencyMap[frequency.type].timesPerIntervalLabel(frequency.timesPerInterval)} {intervalLabel(frequency.interval, frequency.type)} {ending && `until ${endDate && endDate.toLocaleDateString()}`}</Text>
      }
      onReset={() => {
        onChange('frequency', initialState.frequency)
        onChange('ending', initialState.ending)
        onChange('endDate', initialState.endDate)
      }}
    > 
      <FrequencyPicker color={color} initial={{ ...frequency, ending, endDate }}
        onSelectFrequency={(key: string, selected: any) => onChange('frequency', frequency[key] ? { ...frequency, [key]: selected } : selected)}
        onSelectEndDate={(key: 'ending' | 'endDate', value: boolean | Date) => onChange(key, value)}
      />
    </ModalInput>
  )

  const mainTable = [
    { key: 'pets', label: 'Pets', icon: 'pets', value: renderPets },
    { key: 'startDate', label: 'Start Date', icon: 'schedule', value: renderStartDate },
    { key: 'repeat', label: 'Repeat', icon: 'repeat', value: renderRepeat },
    { key: 'frequency', label: 'Frequency', icon: 'due', value: renderFrequency },
  ]

  const headerActions = [
    { icon: 'reset', onPress: onReset },
    { title: status === 'pending' ? 'Submitting...' : 'Submit', onPress: handleValidate },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' bgColor={Colors.multi.lightest[color]} />
    })
  }, [handleValidate, status, color])
  
  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      <TitleInput initial={initialState.name} placeholder='New Task' onChange={(input: string) => onChange('name', input)} type='care' error={errors?.name} />

      <ColorPicker selected={color} buttonWidth={30} pickerStyles={{ marginTop: 10 }} onPress={(selected) => {
        onChange('color', selected)
        setColor(selected)
      }} />

      <TableForm table={mainTable} withLabel={true} dependentRows={{ frequency: repeat }}/>

    </ScrollView>
  )
}

export default CareForm