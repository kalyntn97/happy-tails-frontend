import RNDateTimePicker from '@react-native-community/datetimepicker'
import React, { FC, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
//helpers & types
import { CHART_PARAMS, STATS, filterByRange, getAverageValue, getUnitKey, statConverter } from '@stat/statHelpers'
import { Stat } from '@stat/statInterface'
import { getActionIconSource, getStatIconSource, getStatQualIconSource } from '@utils/ui'
//store & queries
import { useDisplayUnits } from '@store/store'
//components
import LineChart from '@components/Charts/LineChart'
import ToggleableForm from '@components/ToggleableForm'
import { CircleIcon, FormHeader, ScrollScreen } from '@components/UIComponents'
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'

interface StatDetailsProps {
  navigation: any
  route: { params: { stat: Stat }}
}

const StatDetails: FC<StatDetailsProps> = ({ navigation, route }) => {
  const { stat } = route.params
  const name = STATS[stat.name].name
  const records = [...stat.records].reverse()
  const ranges = CHART_PARAMS.range
  const initialAvg = getAverageValue(records.map(r => r.value))
  const displayUnits = useDisplayUnits()
  const unit = displayUnits[getUnitKey(stat.name)]
  const defaultUnit = STATS[stat.name].unit

  const [selectedRange, setSelectedRange] = useState('All')
  const [filtered, setFiltered] = useState(records)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const [avg, setAvg] = useState<string>(initialAvg)

  const changeRange = (range: string) => {
    setSelectedRange(range)
    const { filtered, endDate } = filterByRange(range, records, startDate.toISOString())
    setFiltered(filtered)
    setEndDate(endDate ? endDate.toDateString().slice(4) : null)
    const avgValue = getAverageValue(filtered.map(r => r.value))
    setAvg(Number.isNaN(Number(avgValue)) ? '0' : avgValue)
  }

  return (
    <ScrollScreen>
      <CircleIcon type='stat' name={stat.name} />
      <FormHeader title={name} />
      <ToggleableForm title='See graph' content={
        <LineChart />
      } />

      <View style={styles.filterBtnCon}>
        {ranges.map((range, index) =>
          <Pressable key={range} onPress={() => changeRange(range)}>
            <Text style={[selectedRange === range ? Typography.focused : Typography.unFocused, { fontSize: 15 }]}>{range}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.rangeCon}>
        <View style={styles.dateRangeCon}>
          <RNDateTimePicker value={startDate} themeVariant='light' accentColor={Colors.pink.darkest} maximumDate={new Date()} onChange={(event, selectedDate) => {
            setStartDate(selectedDate)
            changeRange(selectedRange)
          }} />
          <Text> - </Text>
          <View style={styles.endDate}>
            <Text style={[{ fontSize: 17 }, !endDate && { ...Typography.unFocused, fontStyle: 'italic' }]}>{endDate ?? 'M D Y'}</Text>
          </View>
        </View>
        <View style={Spacing.flexRow}>
          <Text>Avg: </Text>
          <Text style={{ ...Typography.focused, fontSize: 25 }}>{avg}</Text>
          <Text>{ STATS[stat.name].type === 'qual' && ' / 5' }</Text>
        </View>

      </View>

      <View style={[styles.rowCon, styles.tableHeaderCon]}>
        <View style={[styles.columnCon, styles.leftColumn]}>
          <Image source={getActionIconSource('date')} style={{ ...UI.icon(), marginRight: 10 }} />
          <Text>Date</Text>
        </View>
        <View style={[styles.columnCon, styles.rightColumn]}>
          <Text>{name}{unit && <Text> ({unit})</Text>}</Text>
        </View>
      </View>

      {filtered.map((record, index) =>
        <View key={record._id} style={styles.rowCon}>
          <View style={[styles.columnCon, styles.leftColumn]}>
            <Text style={styles.column}>{new Date(record.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={[styles.columnCon, styles.rightColumn]}>
            {stat.name === 'mood' ? <Image source={getStatQualIconSource(stat.name, record.value)} style={{ ...UI.icon() }} /> 
            : <Text style={styles.column}>{(unit === defaultUnit || !unit) ? record.value : statConverter(stat.name, record.value.toString(), unit)}</Text>
            }
            
          </View>
        </View>
      )}

    </ScrollScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
  },
  tableCon: {
    width: '90%',
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 8,
    padding: 5,
  },
  rowCon: {
    ...Spacing.flexRow,
    width: '90%',
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.shadow.dark,
  },
  columnCon: {
    ...Spacing.flexRow,
    width: '50%',
    height: '100%',
    paddingHorizontal: 20,
  },
  leftColumn: {
    justifyContent: 'flex-start'
  },
  rightColumn: {
    justifyContent: 'flex-end'
  },
  column: {

  },
  tableHeaderCon: {
    height: 40,
  },
  filterBtnCon: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-evenly',
    padding: 10,
    marginBottom: 10,
  },
  rangeCon: {
    ...Spacing.flexRow,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  dateRangeCon: {
    ...Spacing.flexRow,
  },
  endDate: { 
    borderColor: Colors.shadow.light, 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 8, 
    borderWidth: 2 
  }
})

export default StatDetails
