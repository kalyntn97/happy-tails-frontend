import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { ReactElement, useState } from 'react'
//styles
import { Buttons, Colors, Spacing, Forms, Typography } from '@styles/index'
import { getActionIconSource } from '@utils/ui'
import ScrollSelector from './ScrollSelector'
import { daysOfWeek, getOrdinalSuffix, months } from '@utils/datetime'
import RNDateTimePicker from '@react-native-community/datetimepicker'

export type Frequency = {
  type: 'days' | 'weeks' | 'months' | 'years' | string
  interval: number
  days: number
  timesPerInterval: any[]
}

type Props = {
  initial?: Frequency
  color: number
}

const FrequencyPicker = ({ initial, color }: Props) => {
  const [type, setType] = useState<Frequency['type']>(initial?.type ?? 'days')
  const [interval, setInterval] = useState<Frequency['interval']>(initial?.interval ?? 1)
  const [timesPerInterval, setTimesPerInterval] = useState<Frequency['timesPerInterval']>(initial?.timesPerInterval ?? [1])
  const [intervalOpen, setIntervalOpen] = useState(false)
  const [timesIntervalOpen, setTimesIntervalOpen] = useState(false)
  const numArray = (length: number) => {
    return Array.from({ length: length }, (_, index) => index + 1)
  }
  const monthNames = months.map(m => m.slice(0, 3))

  const WeeklyLabel = () => (
    <Text>on {timesPerInterval.map((i, index) => 
        <Text>{daysOfWeek[i].slice(0, 3)}{index === timesPerInterval.length - 1 ? '' : ', '}</Text>
    )}</Text>
  )

  const MonthlyLabel = () => (
    <Text>on {timesPerInterval.map((i, index) => 
      <Text>{getOrdinalSuffix(i)}{index === timesPerInterval.length - 1 ? '' : ', '}</Text>
  )}</Text>
  )

  const frequencyMap: Record<string, { label: string, intervalArray: number[], timesPerIntervalArray: any[], timesPerIntervalLabel: () => string | ReactElement, singleLabel: string }> = {
    days: { 
      label: 'Daily', singleLabel: 'day', intervalArray: numArray(60), 
      timesPerIntervalArray: numArray(10), timesPerIntervalLabel: () => `${timesPerInterval[0]} ${ timesPerInterval[0] === 1 ? 'time' : 'times' } a day`
    },
    weeks: { 
      label: 'Weekly', singleLabel: 'week', intervalArray: numArray(10),  
      timesPerIntervalArray: daysOfWeek, timesPerIntervalLabel: () => <WeeklyLabel />,
    },
    months: { 
      label: 'Monthly', singleLabel: 'month', intervalArray: numArray(24),  
      timesPerIntervalArray: numArray(31), timesPerIntervalLabel: () => <MonthlyLabel />,
    },
    years: { 
      label: 'Yearly', singleLabel: 'year', intervalArray: numArray(3), 
      timesPerIntervalArray: [{ Jan: 1 }], timesPerIntervalLabel: () => `on ${timesPerInterval.map(obj => {
        const month = Object.keys(obj)[0] ?? 'Jan'
        const date = obj[month] ?? 1
        return `${month} ${getOrdinalSuffix(date)}`
      })}`
    },
  }
  const frequencyKeys = Object.keys(frequencyMap)
  const singleLabel = frequencyMap[type].singleLabel
  const intervalLabel = () => `Every ${ interval > 1 ? `${interval} ` : '' }${ interval === 1 ? frequencyMap[type].singleLabel : type}`

  const DateSelector = () => (
    <View style={[Spacing.flexRow, { flexWrap: 'wrap', width: '100%' }]}>
      { frequencyMap[type].timesPerIntervalArray.map((day, index) => {
        const position = type === 'weeks' ? index : index + 1
        const selected = timesPerInterval.includes(position)
        const label = type === 'weeks' ? day.slice(0, 2) : day
        return (
          <Pressable key={day}
            onPress={() => setTimesPerInterval(prev => {
              let updated = selected ? prev.filter(p => p !== position) : [...prev, position]
              return updated.sort((a, b) => a - b)
            })}
            style={[styles.circleBtn, { backgroundColor: selected ? Colors.multi.reg[color] : Colors.shadow.light }]}>
            <Text>{label}</Text>
          </Pressable>
        )
      }) }
    </View>
  )

  const DropHeader = ({ title, rightLabel, onPress }: { title: string, rightLabel: () => string, onPress: () => void }) => (
    <View style={styles.dropBtnCon}>
      <Text style={styles.dropBtnLabel}>{title}</Text>
      <Pressable style={styles.dropBtn} onPress={onPress}>
        {/* <View > */}
          <Text style={styles.btnText}>{rightLabel()}</Text>
        {/* </View> */}
        <Image source={getActionIconSource('down')} style={[Forms.xSmallIcon, { marginLeft: 'auto' }]} />
      </Pressable>
    </View>
  )

  const onChangeType = (type: string) => {
    setType(type)
    setTimesPerInterval(_ => {
      const defaultValue = type === 'years' ? [{ Jan: 1 }] : [1]
      return initial?.timesPerInterval ?? defaultValue
    })
    setInterval(initial?.interval ?? 1)
  }

  return (
    <View style={styles.container}>
      {/* <View style={[styles.rowCon, Spacing.flexRow]}> */}
      <Text style={Typography.smallHeader}>Repeats {frequencyMap[type].timesPerIntervalLabel()} {intervalLabel()}</Text>
        <View style={styles.btnCon}>
          {frequencyKeys.map((f, index) =>
            <Pressable key={index} onPress={() => onChangeType(f)} style={[styles.btn,
              index === 0 && { ...Forms.leftMoreRounded},
              index === frequencyKeys.length - 1 && { ...Forms.rightMoreRounded },
              { backgroundColor: f === type ? Colors.multi.light[color ?? 0] : Colors.shadow.light, borderRadius: type === f && 15 },
            ]}>
              <Text>{frequencyMap[f].label}</Text>
            </Pressable>
          )}
        </View>
      {/* </View> */}
      <View style={[styles.rowCon, Spacing.flexColumn]}>
        {/* <DropHeader title='Frequency' onPress={() => setTimesIntervalOpen(!timesIntervalOpen)} rightLabel={frequencyMap[type].timesPerIntervalLabel} /> */}
        {/* { timesIntervalOpen && <> */}
          { type === 'days' ? <ScrollSelector data={frequencyMap[type].timesPerIntervalArray} initial={initial?.timesPerInterval[0]} onSelect={(selected: number) => setTimesPerInterval([selected + 1])}  rightLabel={`${timesPerInterval[0] === 1 ? 'time' : 'times'} a ${singleLabel}`} />
            : type === 'weeks' ? <DateSelector />
            : type === 'months' ? <DateSelector />
            : type === 'years' && <View style={Spacing.flexRow}>
              <ScrollSelector data={monthNames} initial={initial?.timesPerInterval[0]} onSelect={(selected: number) => setTimesPerInterval(prev => [...prev, { [monthNames[selected]] : 1 }])}  />
              <ScrollSelector data={numArray(31)} initial={initial?.timesPerInterval[0]} onSelect={(selected: number) => setTimesPerInterval(prev => prev.map((p, i) => {
                const lastEntry = prev[prev.length - 1]
                const lastEntryKey = Object.keys(lastEntry)[0]
                return i === prev.length - 1 ? { [lastEntryKey]: selected + 1 } : p
              }))} />
            </View>
          }
        {/* </> } */}
      </View>

      <View style={[styles.rowCon, Spacing.flexColumn]}>
        <DropHeader title='Interval' onPress={() => setIntervalOpen(!intervalOpen)} rightLabel={intervalLabel} />
        { intervalOpen &&  
          <View style={{ width: '50%'}}>
            <ScrollSelector data={frequencyMap[type].intervalArray} initial={initial?.interval} onSelect={(selected: number) => setInterval(frequencyMap[type].intervalArray[selected])} leftLabel='every' rightLabel={interval === 1 ? singleLabel : type} />
          </View>
        }
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    width: '100%',
  },
  rowCon: {
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: Colors.shadow.dark,
  },
  btn: {
    ...Spacing.centered,
    flex: 1,
    height: 40,
  },
  btnCon: {
    ...Spacing.flexRow,
    backgroundColor: Colors.shadow.light, 
    borderRadius: 15,
  },
  dropBtnCon: {
    ...Spacing.flexRow,
    width: '100%',
    justifyContent: 'space-between', 
  },
  dropBtnLabel: {
    ...Typography.xSmallHeader,
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
    width: 30,
    height: 30,
    margin: 5,
  }
})

export default FrequencyPicker