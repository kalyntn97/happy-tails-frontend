import { useCallback, useEffect } from "react"
//components
import { ToggleButton } from "@components/ButtonComponents"
import ColorPicker from "@components/Pickers/ColorPicker"
import { FrequencySelector } from "@components/Pickers/FrequencyPicker"
import { PetSelector } from "@components/Pickers/PetPicker"
import TitleInput from "@components/TitleInput"
import { DateInput, ScrollScreen, TableForm } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
//types && hooks
import type { CareFormData } from "@care/CareInterface"
import { useShallowPets } from "@hooks/sharedHooks"
import useForm from "@hooks/useForm"
//styles
import { Colors } from '@styles/index'

interface InitialState extends CareFormData {
  ending: boolean
  errors: any
}

interface CareFormProps {
  onSubmit: (formData: CareFormData) => void
  initialValues?: CareFormData
  status: string
  navigation: any
}

const CareForm: React.FC<CareFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const { PET_BASICS } = useShallowPets()
  const initialState: InitialState = {
    name: initialValues?.name ?? null, 
    pets: initialValues?.pets ?? [PET_BASICS[0]._id],
    repeat: initialValues?.repeat ?? false,
    startDate: initialValues?.startDate ?? new Date().toISOString(),
    endDate: initialValues?.endDate ?? null,
    frequency: initialValues?.frequency ?? { type: 'days', interval: 1, timesPerInterval: [1] },
    color: initialValues?.color ?? 0,
    careId: initialValues?.careId ?? null,
    ending: !!initialValues?.endDate,
    errors: null,
  }
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, pets, repeat, startDate, ending, endDate, frequency, color, careId, errors } = values

  const mainTable = [
    { key: 'pets', label: 'Pets', icon: 'pets', value: 
      <PetSelector pets={pets} onSelect={(selected: string[]) => onChange('pets', selected)} mode='multi' /> 
    },
    { key: 'startDate', label: 'Start Date', icon: 'schedule', value: 
      <DateInput date={startDate} onChangeDate={(selected) => onChange('startDate', selected)} color={color} /> 
    },
    { key: 'repeat', label: 'Repeat', icon: 'repeat', value: 
      <ToggleButton onPress={() => onChange('repeat', !repeat)} isChecked={repeat} />
    },
    { key: 'frequency', label: 'Frequency', icon: 'due', value: 
      <FrequencySelector frequency={frequency} endDate={endDate} ending={ending} color={color}
        onSelectFrequency={(key: string, selected: any) => onChange('frequency', frequency[key] ? { ...frequency, [key]: selected } : selected)}
        onSelectEndDate={(key: 'ending' | 'endDate', value: boolean | string) => onChange(key, value)}
        onReset={() => {
          onChange('frequency', initialState.frequency)
          onChange('ending', initialState.ending)
          onChange('endDate', initialState.endDate)
        }}
      />
    },
    // { key: 'reminder', label: 'Reminder', icon: 'reminder', value: renderReminder },
  ]

  function handleSubmit() {
    if (!repeat) ['frequency', 'endDate'].map(key => onChange(key, null))
    if (!ending) onChange('endDate', null)

    onSubmit({ name, pets, repeat, startDate, endDate, frequency, color, careId })
  }

  const handleValidate = useCallback(() => onValidate({ name }), [name])

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
    <ScrollScreen bgColor={Colors.multi.lightest[color]}>
      <TitleInput initial={initialState.name} placeholder='New Task' onChange={(input: string) => onChange('name', input)} type='care' error={errors?.name} />

      <ColorPicker selected={color} onPress={(selected) => onChange('color', selected)} />

      <TableForm table={mainTable} withTitle={true} dependentRows={{ frequency: repeat }} />
    </ScrollScreen>
  )
}

export default CareForm