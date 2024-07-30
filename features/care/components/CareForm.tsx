import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, useWindowDimensions, Pressable, Dimensions } from "react-native"
//components
import Dropdown from "@components/Dropdown/Dropdown"
import { CheckboxButton, MainButton, SubButton, ToggleButton, TransparentButton } from "@components/ButtonComponents"
import { DateInput, ErrorMessage, FormInput, FormLabel, BottomModal, ModalInput } from "@components/UIComponents"
import ColorPicker from "@components/ColorPicker"
import PetPicker from "@components/PetPicker"
import TitleInput from "@components/TitleInput"
import FrequencyPicker, { frequencyMap, intervalLabel } from "@components/FrequencyPicker"
import { Header } from "@navigation/NavigationStyles"
//types && hooks
import useForm from "@hooks/useForm"
import { useShallowPets } from "@hooks/sharedHooks"
import { PetBasic } from "@pet/PetInterface"
import type { Care, CareFormData } from "@care/CareInterface"
import { windowHeight } from "@utils/constants"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
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
  const { PET_BASICS } = useShallowPets()
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
    console.log('recreated')
    return onValidate({ name })
  }, [name])

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightAction={handleValidate} rightLabel={status === 'pending' ? 'Submitting...' : 'Submit'} navigation={navigation} mode='modal' />
    })
  }, [handleValidate, status])
  
  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.containerWithPadding, { minHeight: windowHeight * 0.75}]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false} 
    >
      <TitleInput initial={initialState.name} placeholder='New Task' onChange={(input: string) => onChange('name', input)} type='care' error={errors?.name} />

      <FormLabel label='Color' icon="color" />
      <ColorPicker onPress={(selected) => {
        onChange('color', selected)
        setColor(selected)
      }} initial={color} />

      <FormLabel label='Select Pets' icon="pets" width='100%' top={30} />
      <PetPicker mode="multi" onSelect={(selections: string[]) => onChange('pets', selections)} initials={pets.map((pet: PetBasic) => pet._id ?? pet)} />

      <FormLabel label='Start Date' icon="schedule" width='100%' top={30} />
      <DateInput date={startDate} onChangeDate={selectedDate => onChange('startDate', selectedDate)} color={color} />

      <View style={styles.labelCon}>
        <FormLabel label='Repeat' icon="repeat" top={0} bottom={0} />
        <ToggleButton onPress={() => onChange('repeat', !repeat)} initial={repeat} size='small' />
      </View>

      { repeat &&
        <ModalInput maxHeight='90%'
          label={
            <Text>Repeats {frequency && frequencyMap[frequency.type].timesPerIntervalLabel(frequency.timesPerInterval)} {intervalLabel(frequency.interval, frequency.type)} {ending && `until ${endDate && endDate.toLocaleDateString()}`}</Text>
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
      }

      <SubButton onPress={onReset} title='Reset' top={10} bottom={10} />
    </ScrollView>
  )
}

export default CareForm