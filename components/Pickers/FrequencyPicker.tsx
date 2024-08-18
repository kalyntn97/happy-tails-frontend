import RNDateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextStyle, View } from 'react-native'
//utils
import { daysOfWeek, getOrdinalSuffix, months } from '@utils/datetime'
import { showToast } from '@utils/misc'
import { Frequency } from '@utils/types'
//components
import { Icon, ModalInput, ScrollContainer, TitleLabel } from '@components/UIComponents'
import { ActionButton, ToggleButton, TransparentButton } from '../ButtonComponents'
import ScrollSelector from '../ScrollSelector'
//styles
import { Buttons, Colors, Spacing, Typography, UI } from '@styles/index'
import { windowWidth } from '@utils/constants'
import { CustomToast } from '@navigation/NavigationStyles'

export interface FrequencyPicker extends Frequency {
  ending?: boolean 
  endDate?: string
}
type FrequencyPickerKey = 'type' | 'interval' | 'timesPerInterval' | 'frequency'

type Props = {
  frequency?: FrequencyPicker
  color?: number
  onSelectFrequency: (key: FrequencyPickerKey, selected: any) => void
  onSelectEndDate?: (key: 'ending' | 'endDate', value: boolean | string) => void
  onReset: () => void
  labelStyles?: TextStyle
}
type MonthDay = { month: string, day: number }

const ROUNDED: number = 30
const CIRCLE_BUTTON_MARGIN: number = 5
const CIRCLE_BUTTON_WIDTH: number = (windowWidth * 0.9 - CIRCLE_BUTTON_MARGIN * 2 * 7) / 8
const monthNames = months.map(m => m.slice(0, 3))

const numArray = (length: number) => {
  return Array.from({ length: length }, (_, index) => index + 1)
}
const isObjectInArray = (obj: any, array: any[]) => array.some(item => JSON.stringify(item) === JSON.stringify(obj))

const frequencyMap: Record<string, { label: string, intervalArray: number[], timesPerIntervalArray?: any[]}> = {
  days: { label: 'Daily', intervalArray: numArray(60), timesPerIntervalArray: numArray(10) },
  weeks: { label: 'Weekly', intervalArray: numArray(10), timesPerIntervalArray: daysOfWeek },
  months: { label: 'Monthly', intervalArray: numArray(24), timesPerIntervalArray: numArray(31) },
  years: { label: 'Yearly', intervalArray: numArray(3), timesPerIntervalArray: [] }
}

const frequencyKeys = Object.keys(frequencyMap)

const getMonthDayLabel = (month: string, day: number) => `${month} ${getOrdinalSuffix(day)}`

export function getIntervalLabel(interval: number, type: Frequency['type']) { 
  return `every ${ interval > 1 ? `${interval} ` : '' }${ interval === 1 ? type.slice(0, -1) : type}`
}

export function getTimesPerIntervalLabel(timesPerInterval: Frequency['timesPerInterval'], type: Frequency['type']) {
  switch (type) {
    case 'days': {
      const times = timesPerInterval[0]
      return `${times === 1 ? 'once' : times === 2 ? 'twice' : `${times} times`} a day`
    }
    case 'weeks': return `every ${timesPerInterval.map((day: number) => daysOfWeek[day].slice(0, 3)).join(', ')}`
    case 'months': return `every ${timesPerInterval.map((day: number) => getOrdinalSuffix(day)).join(', ')}`
    case 'years': return `every ${timesPerInterval.map((obj) => getMonthDayLabel(obj.month, obj.day)).join(', ')}`
    default: return null
  }
}

const showWarningToast = () => showToast({ text1: 'At least 1 selection is required.', style: 'info' })

const TimesPerDaySelector = ({ type, times, onSelect }: { type: 'days', times: number, onSelect: (selected: number) => void }) => (
  <ScrollSelector data={frequencyMap[type].timesPerIntervalArray} initial={times - 1} 
    rightLabel={`${times === 1 ? 'time' : 'times'} a ${type.slice(0, -1)}`} 
    onSelect={(selected: number) => onSelect(selected + 1)}
  />
)

const DaySelector = ({ type, dayArray, onSelect, color }: { type: 'weeks' | 'months', dayArray: number[], onSelect: (selected: number[]) => void, color: number }) => (
  <View style={styles.circleBtnCon}>
    { frequencyMap[type].timesPerIntervalArray.map((day, index) => {
      const position = type === 'weeks' ? index : index + 1
      const label = type === 'weeks' ? day.slice(0, 2) : day
      const selected = dayArray.includes(position)

      return (
        <Pressable key={day}
          style={[styles.circleBtn, { backgroundColor: selected ? Colors.multi.reg[color] : Colors.shadow.light }]}
          onPress={() => {
            let updated: number[]
              if (selected) {
                if (dayArray.length > 1) updated = dayArray.filter(p => p !== position)
                else {
                  showWarningToast()
                  updated = dayArray
                }
              } else updated = [...dayArray, position]
              if (updated.length > 1) updated.sort((a, b) => a - b)
            onSelect(updated)
          }}>
          <Text>{label}</Text>
        </Pressable>
      )
    }) }
  </View>
)

const MonthDaySelector = ({ onSelect }: { onSelect: (selected: MonthDay) => void }) => {
  const [month, setMonth] = useState<string>('Jan')
  const [day, setDay] = useState<number>(1)

  return (
    <View style={Spacing.flexColumnStretch}>
      <View style={Spacing.flexRow}>
        <ScrollSelector data={monthNames} onSelect={(selected: string) => setMonth(monthNames[selected])} />
        <ScrollSelector data={numArray(31)} onSelect={(selected: number) => setDay(selected + 1)} />
      </View>
      <TransparentButton title='add' icon='increase' onPress={() => onSelect({ month: month, day: day })} size='small' />
    </View>
  )
}

const YearlySelector = ({ dayArray, onSelect }: { dayArray: MonthDay[], onSelect: (selected: MonthDay[]) => void}) => (
  <View style={Spacing.flexColumn}>
    <View style={styles.dayBtnCon}>
      { dayArray.map((obj, index) => {
        const monthDayLabel = getMonthDayLabel(obj.month, obj.day)
        return <ActionButton key={`${obj.month}-${obj.day}`} title={monthDayLabel} icon='decrease' size='xSmall' buttonStyles={{ margin: 15 }} onPress={() => {
          let updatedArray = []
          if (dayArray.length > 1) updatedArray = dayArray.filter((_, i) => i !== index) 
          else { 
            showWarningToast()
            updatedArray = dayArray
          }
          return onSelect(updatedArray)
        }} />
      })}
    </View>
    <MonthDaySelector onSelect={(selected) => {
      const dayExisted = isObjectInArray(selected, dayArray)
      if (dayExisted) {
        return showToast({ text1: 'Day is already added.', style: 'info' })
      } else return onSelect([...dayArray, selected])
    }} />
  </View>
)

const TypeSelector = ({ type, onSelect, color }: { type: Frequency['type'], onSelect: (selected: Frequency['type']) => void, color: number }) => (
  <View style={styles.btnCon}>
    {frequencyKeys.map((f, index) =>
      <Pressable key={f} onPress={() => onSelect(f as Frequency['type'])} style={[styles.btn,
        index === 0 && UI.rounded('left', ROUNDED),
        index === frequencyKeys.length - 1 && UI.rounded('right', ROUNDED),
        { backgroundColor: f === type ? Colors.multi.light[color] : Colors.shadow.light, borderRadius: type === f && ROUNDED },
      ]}>
        <Text>{frequencyMap[f].label}</Text>
      </Pressable>
    )}
  </View>
)

const IntervalSelector = ({ type, interval, onSelect, intervalLabel }: { type: Frequency['type'], interval: Frequency['interval'], onSelect: (selected: Frequency['interval']) => void, intervalLabel: string }) => {
  const [intervalOpen, setIntervalOpen] = useState<boolean>(false)

  return (
    <View style={styles.rowCon}>
      <TitleLabel title='Interval' onPress={() => setIntervalOpen(!intervalOpen)} rightAction={
        <View style={Spacing.flexRow}>     
          <Text style={styles.btnText}>{intervalLabel}</Text>
          <Icon name={intervalOpen ? 'up' : 'down'} size='xSmall' styles={{ marginVertical: 0, marginLeft: 'auto' }} />
        </View>
      } />
      { intervalOpen && 
        <ScrollSelector data={frequencyMap[type].intervalArray} initial={interval - 1} onSelect={(selected: number) => onSelect(selected + 1)} leftLabel='every' rightLabel={interval === 1 ? type.slice(0, -1) : type} />
      }
    </View>
  )
}

const EndDateSelector = ({ endDate, ending, onSelect, color }: { endDate: string, ending: boolean, onSelect: (key: 'ending' | 'endDate', selected: string | boolean) => void , color: number }) => (
  <View style={[styles.rowCon, { borderBottomWidth: 0 }]}>
    <TitleLabel title='End Date' rightAction={
      <ToggleButton isChecked={ending} onPress={() => {
        if (ending) onSelect('endDate', null)
        else if (!endDate) onSelect('endDate', new Date().toISOString())
        onSelect('ending', !ending)
      }} /> 
    } />
    { ending && 
      <RNDateTimePicker display='inline' themeVariant='light' value={endDate ? new Date(endDate) : new Date()} minimumDate={new Date()} onChange={(_, selectedDate) => onSelect('endDate', selectedDate.toISOString())} accentColor={Colors.multi.dark[color]} />
    }
</View>
)

const FrequencyPicker = ({ frequency, onSelectFrequency, onSelectEndDate, onReset, color = 0, labelStyles}: Props) => {
  const { type, interval, timesPerInterval, ending, endDate } = frequency

  const timesPerIntervalLabel = getTimesPerIntervalLabel(timesPerInterval, type)
  const intervalLabel = getIntervalLabel(interval, type)
  const endingLabel = ending && endDate ? `until ${new Date(endDate).toLocaleDateString()}` : ''
  const frequencyLabel = `Repeats ${timesPerIntervalLabel} ${intervalLabel} ${endingLabel}`

  const onChangeType = (type: Frequency['type']) => {
    let defaultTimesPerInterval = type === 'years' ? [{ month: 'Jan', day: 1 }] : [1]
    onSelectFrequency('frequency', { type: type, interval: 1, timesPerInterval: defaultTimesPerInterval })
  }

  return (
    <ModalInput maxHeight='90%' onReset={onReset}
      label={<Text style={labelStyles}>{frequencyLabel}</Text>}
    > 
      <View style={Spacing.fullCon()}>
        <Text style={Typography.subHeader}>{frequencyLabel}</Text>
        <ScrollContainer>
          <TypeSelector type={type} onSelect={onChangeType} color={color} />

          <View style={styles.rowCon}>
            { type === 'days' 
              ? <TimesPerDaySelector type='days' times={timesPerInterval[0]} onSelect={(selected: number) => onSelectFrequency('timesPerInterval', [selected])} />
              : (type === 'weeks' || type === 'months') ? <DaySelector type={type} dayArray={timesPerInterval} onSelect={(selected: number[]) => onSelectFrequency('timesPerInterval', selected)} color={color} />
              : type === 'years' && <YearlySelector dayArray={timesPerInterval} onSelect={(selected: MonthDay[]) => onSelectFrequency('timesPerInterval', selected)} />
            }
          </View>

          <IntervalSelector type={type} interval={interval} intervalLabel={intervalLabel} onSelect={(selected: Frequency['interval']) => onSelectFrequency('interval', selected)} />

          { onSelectEndDate && <EndDateSelector endDate={endDate} ending={ending} onSelect={(key: 'ending' | 'endDate', selected: string | boolean) => onSelectEndDate(key, selected)} color={color} /> }
        </ScrollContainer>

        <CustomToast />
      </View>
    </ModalInput>
  )
}

const styles = StyleSheet.create({
  rowCon: {
    ...UI.tableRow(true),
    ...Spacing.basePadding(0, 15),
    alignItems: 'center',
  },
  btn: {
    ...Spacing.centered,
    flex: 1,
    height: 40,
  },
  btnCon: {
    ...Spacing.flexRow,
    backgroundColor: Colors.shadow.light, 
    borderRadius: ROUNDED,
  },
  btnText: {
    ...Typography.regBody,
    marginVertical: 0,
    marginRight: 10,
  },
  circleBtn: {
    ...Buttons.circle,
    width: CIRCLE_BUTTON_WIDTH,
    height: CIRCLE_BUTTON_WIDTH,
    margin: CIRCLE_BUTTON_MARGIN,
  },
  circleBtnCon: {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    maxWidth: (CIRCLE_BUTTON_WIDTH + CIRCLE_BUTTON_MARGIN * 2) * 7,
  },
  dayBtnCon: {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
  }
})

export default FrequencyPicker