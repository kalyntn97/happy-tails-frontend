import RNDateTimePicker from '@react-native-community/datetimepicker'
import React, { ReactElement, useEffect, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
//utils
import { daysOfWeek, getOrdinalSuffix, months } from '@utils/datetime'
import { Frequency } from '@utils/types'
import { getActionIconSource } from '@utils/ui'
//components
import { ToggleButton } from '../ButtonComponents'
import ScrollSelector from '../ScrollSelector'
//styles
import { ScrollContainer } from '@components/UIComponents'
import { Buttons, Colors, Spacing, Typography, UI } from '@styles/index'
import { windowWidth } from '@utils/constants'


export interface FrequencyPicker extends Frequency {
  ending?: boolean
  endDate?: Date
}

type Props = {
  initial?: FrequencyPicker
  color?: number
  onSelectFrequency: (key: string, selected: any) => void
  onSelectEndDate?: (key: 'ending' | 'endDate', value: boolean | Date) => void
}

const ROUNDED: number = 30
const CIRCLE_BUTTON_MARGIN: number = 5
const CIRCLE_BUTTON_WIDTH: number = (windowWidth * 0.9 - CIRCLE_BUTTON_MARGIN * 2 * 7) / 8

const numArray = (length: number) => {
  return Array.from({ length: length }, (_, index) => index + 1)
}

const DailyLabel = ({ timesPerInterval }: { timesPerInterval: any[]}) => {
  let label: string
  switch (timesPerInterval[0]) {
    case 1: label = 'once'; break
    case 2: label = 'twice'; break
    default: label = `${timesPerInterval[0]} times`
  }
  return <Text>{label}</Text>
}

const WeeklyLabel = ({ timesPerInterval }: { timesPerInterval: any[]}) => (
  <Text>on {timesPerInterval.map((i, index) => 
    <Text key={i}>{daysOfWeek[i].slice(0, 3)}{index === timesPerInterval.length - 1 ? '' : ', '}</Text>
  )}</Text>
)

const MonthlyLabel = ({ timesPerInterval }: { timesPerInterval: any[]}) => (
  <Text>on { timesPerInterval.map((i, index) => 
    <Text key={i}>{getOrdinalSuffix(i)}{index === timesPerInterval.length - 1 ? '' : ', '}</Text>
  ) }</Text>
)

const YearlyLabel = ({ timesPerInterval }: { timesPerInterval: any[]}) => (
  <Text>on { timesPerInterval.map((obj, index) => {
    const month = Object.keys(obj)[0] ?? 'Jan'
    const date = obj[month] ?? 1
    return <Text key={index}>{month} {getOrdinalSuffix(date)}{index === timesPerInterval.length - 1 ? '' : ', '}</Text>
  }) }</Text>
)

export const frequencyMap: Record<string, { label: string, intervalArray: number[], timesPerIntervalArray?: any[], timesPerIntervalLabel: (timesPerInterval: any[]) => string | ReactElement }> = {
  days: { 
    label: 'Daily', intervalArray: numArray(60), 
    timesPerIntervalArray: numArray(10), timesPerIntervalLabel: (timesPerInterval: number[]) => <DailyLabel timesPerInterval={timesPerInterval}/>
  },
  weeks: { 
    label: 'Weekly', intervalArray: numArray(10),  
    timesPerIntervalArray: daysOfWeek, timesPerIntervalLabel: (timesPerInterval: number[]) => <WeeklyLabel timesPerInterval={timesPerInterval} />,
  },
  months: { 
    label: 'Monthly', intervalArray: numArray(24),  
    timesPerIntervalArray: numArray(31), timesPerIntervalLabel: (timesPerInterval: number[]) => <MonthlyLabel timesPerInterval={timesPerInterval} />,
  },
  years: { 
    label: 'Yearly', intervalArray: numArray(3), 
    // timesPerIntervalArray: initial?.timesPerInterval ?? [{ Jan: 1 }],
    timesPerIntervalLabel: (timesPerInterval: any[]) => <YearlyLabel timesPerInterval={timesPerInterval} />, 
  }
}

export function intervalLabel(interval: number, type: Frequency['type']) { 
  return `every ${ interval > 1 ? `${interval} ` : '' }${ interval === 1 ? type.slice(0, -1) : type}`
}

const DropHeader = ({ title, rightLabel, onPress, icon }: { title: string, rightLabel: () => string, onPress: () => void, icon: string }) => (
  <View style={styles.dropBtnCon}>
    <Text style={styles.dropBtnLabel}>{title}</Text>
    <Pressable style={styles.dropBtn} onPress={onPress}>
      {/* <View > */}
        <Text style={styles.btnText}>{rightLabel()}</Text>
      {/* </View> */}
      <Image source={getActionIconSource(icon)} style={[UI.icon('xSmall'), { marginLeft: 'auto' }]} />
    </Pressable>
  </View>
)

const FrequencyPicker = ({ initial, color = 0, onSelectFrequency, onSelectEndDate }: Props) => {
  const initialState = {
    type: initial?.type ?? 'days',
    interval: initial?.interval ?? 1,
    timesPerInterval: initial?.timesPerInterval ?? [1],
    ending: initial?.ending ?? false,
    endDate: initial?.endDate ?? new Date(),
    intervalOpen: false,
  }

  const [type, setType] = useState<FrequencyPicker['type']>(initialState.type)
  const [interval, setInterval] = useState<FrequencyPicker['interval']>(initialState.interval)
  const [timesPerInterval, setTimesPerInterval] = useState<FrequencyPicker['timesPerInterval']>(initialState.timesPerInterval)
  const [ending, setEnding] = useState<FrequencyPicker['ending']>(initialState.ending)
  const [endDate, setEndDate] = useState<FrequencyPicker['endDate']>(initialState.endDate)
  const [intervalOpen, setIntervalOpen] = useState<boolean>(initialState.intervalOpen)
  
  const monthNames = months.map(m => m.slice(0, 3))

  const frequencyKeys = Object.keys(frequencyMap)

  const DateSelector = () => (
    <View style={styles.circleBtnCon}>
      { frequencyMap[type].timesPerIntervalArray.map((day, index) => {
        const position = type === 'weeks' ? index : index + 1
        const selected = timesPerInterval.includes(position)
        const label = type === 'weeks' ? day.slice(0, 2) : day
        return (
          <Pressable key={day}
            onPress={() => {
              let updated: number[]
              setTimesPerInterval(prev => {
                if (selected) {
                  if (prev.length > 1) updated = prev.filter(p => p !== position)
                  else updated = prev
                } else updated = [...prev, position]
                if (updated.length > 1) updated.sort((a, b) => a - b)
                return updated
              })
              onSelectFrequency('timesPerInterval', updated)
            }}
            style={[styles.circleBtn, { backgroundColor: selected ? Colors.multi.reg[color] : Colors.shadow.light }]}>
            <Text>{label}</Text>
          </Pressable>
        )
      }) }
    </View>
  )

  const onChangeType = (type: string) => {
    setType(type)
    let defaultTimesPerInterval = type === 'years' ? [{ Jan: 1 }] : [1]
    setTimesPerInterval(defaultTimesPerInterval)
    setInterval(1)
    onSelectFrequency('frequency', { type, interval: 1, timesPerInterval: defaultTimesPerInterval })
  }

  const Header = () => (
    <Text style={Typography.smallHeader}>Repeats {frequencyMap[type].timesPerIntervalLabel(timesPerInterval)} {intervalLabel(interval, type)} {ending && `until ${endDate.toLocaleDateString()}`}</Text>
  )

  const onReset = () => {
    setType(initialState.type)
    setTimesPerInterval(initialState.timesPerInterval)
    setInterval(initialState.interval)
    setEnding(initialState.ending)
    setEndDate(initialState.endDate)
  }

  useEffect(() => {
    onReset()
  }, [initial])

  return (
    <>
      <Header />
      <ScrollContainer>
        <View style={styles.rowCon}>
          <View style={styles.btnCon}>
            {frequencyKeys.map((f, index) =>
              <Pressable key={f} onPress={() => onChangeType(f)} style={[styles.btn,
                index === 0 && { ...UI.rounded('left', 30)()(ROUNDED) },
                index === frequencyKeys.length - 1 && { ...UI.rounded('right', 30)(ROUNDED) },
                { backgroundColor: f === type ? Colors.multi.light[color] : Colors.shadow.light, borderRadius: type === f && ROUNDED },
              ]}>
                <Text>{frequencyMap[f].label}</Text>
              </Pressable>
            )}
          </View>

          { type === 'days' ?
            <View style={styles.scrollCon}>
              <ScrollSelector data={frequencyMap[type].timesPerIntervalArray} initial={timesPerInterval[0] - 1} 
                  rightLabel={`${timesPerInterval[0] === 1 ? 'time' : 'times'} a ${type.slice(0, -1)}`} 
                  onSelect={(selected: number) => {
                    setTimesPerInterval([selected + 1])
                    onSelectFrequency('timesPerInterval', [selected + 1])
                  }}
                />
            </View>
            : type === 'weeks' ? <DateSelector />
            : type === 'months' ? <DateSelector />
            : type === 'years' && <View style={Spacing.flexRow}>
              <ScrollSelector data={monthNames} initial={timesPerInterval[0]} onSelect={(selected: number) => {
                let value = []
                setTimesPerInterval(prev => {
                  value = [...prev, { [monthNames[selected]] : 1 }]
                  return value
                })
                onSelectFrequency('timesPerInterval', value)
              }}  />
              <ScrollSelector data={numArray(31)} initial={timesPerInterval[0]} onSelect={(selected: number) => {
                let value = []
                setTimesPerInterval(prev => {
                  value = prev.map((p, i) => {
                    const lastEntry = prev[prev.length - 1]
                    const lastEntryKey = Object.keys(lastEntry)[0]
                    return i === prev.length - 1 ? { [lastEntryKey]: selected + 1 } : p
                  })
                  return value
                })
                onSelectFrequency('timesPerInterval', value)
              }} />
            </View>
          }
        </View>

        <View style={styles.rowCon}>
          <DropHeader title='Interval' onPress={() => setIntervalOpen(!intervalOpen)} rightLabel={() => intervalLabel(interval, type)} icon={intervalOpen ? 'up' : 'down'} />
          { intervalOpen &&  
            <View style={styles.scrollCon}>
              <ScrollSelector data={frequencyMap[type].intervalArray} initial={initial?.interval - 1} onSelect={(selected: number) => {
                setInterval(selected + 1)
                onSelectFrequency('interval', selected + 1)
              }} leftLabel='every' rightLabel={interval === 1 ? type.slice(0, -1) : type} />
            </View>
          }
        </View>

        { onSelectEndDate &&
          <View style={styles.rowCon}>
            <View style={styles.dropBtnCon}>
              <Text style={styles.dropBtnLabel}>End Date</Text>
              <ToggleButton isChecked={ending} onPress={() => {
                setEnding(!ending)
                onSelectEndDate('ending', !ending)
                ending && onSelectEndDate('endDate', endDate)
              }} />
            </View>
            { ending && 
              <RNDateTimePicker display='inline' themeVariant='light' value={new Date(endDate)} minimumDate={new Date()} onChange={(_, selectedDate) => {
                setEndDate(selectedDate)
                onSelectEndDate('endDate', selectedDate) 
              }} accentColor={Colors.multi.dark[color]} />
            }
          </View>
        }
      </ScrollContainer>
    </>
  )
}

const styles = StyleSheet.create({
  rowCon: {
    ...UI.tableRow(true),
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
  dropBtnCon: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-between', 
  },
  dropBtnLabel: {
    ...Typography.smallHeader,
    margin: 0,
    color: Colors.shadow.darkest,
  },
  dropBtn: {
    ...Spacing.flexRow,
  },
  btnText: {
    ...Typography.smallBody,
    marginRight: 10,
    marginLeft: 'auto',
    maxWidth: '80%',
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
    paddingTop: 15,
  },
  scrollCon: {
    height: 150,
  }
})

export default FrequencyPicker