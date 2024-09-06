import { StyleSheet, Text, View } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
//components
import { FormHeader, Icon, ModalInput } from '@components/UIComponents'
//utils
import { convertToTimeString, getCurrentTimeString } from '@utils/datetime'
//styles
import { Colors, Spacing, Typography } from '@styles/index'
import ScrollSelector from '@components/ScrollSelector'

export type Time = { hours: string, minutes: string, amOrPm: string }
type Props = {
  time: Time
  onSelect: (time: Time) => void
}

const hourArr = Array.from({ length: 12 }, (_, i) => {
  const index = i === 0 ? 12 : i
  return String(index).padStart(2, '0')
})
const minuteArr = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

const TimePicker = ({ time, onSelect }: Props) => {
  const currentTime = getCurrentTimeString().time
  const timeString = convertToTimeString(time)

  return (
    <ModalInput overlay={Colors.white} onReset={() => onSelect({ hours: currentTime.hours, minutes: currentTime.minutes, amOrPm: currentTime.amOrPm })} customLabel={
      <View style={Spacing.flexRow}>
        <Text style={styles.time}>{timeString}</Text>
        <Icon name='edit' size='xxSmall'/>
      </View>
    }>
      <View style={styles.scrollCon}>
        <ScrollSelector data={hourArr} onSelect={(selected) => onSelect({ ...time, hours: selected })} initial={hourArr.findIndex(h => h === time.hours)} loop={true} height={60} />
        <Text style={Typography.subHeader}>:</Text>
        <ScrollSelector data={minuteArr} onSelect={(selected) => onSelect({ ...time, minutes: selected })} initial={minuteArr.findIndex(m => m === time.minutes)} loop={true} height={60} />
        <ScrollSelector data={['AM', 'PM']}  onSelect={(selected) => onSelect({ ...time, amOrPm: selected })} initial={time.amOrPm === 'AM' ? 0 : 1} height={60} />
      </View>
    </ModalInput>
  )
}

export default TimePicker

const styles = StyleSheet.create({
  scrollCon: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-between',
  },
  time: {
    marginRight: 10,
    ...Typography.regBody,
  }
})