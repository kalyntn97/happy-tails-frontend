import RNDateTimePicker from '@react-native-community/datetimepicker'
import React, { FC, useMemo, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
//helpers & types
import { STATS, TIME_RANGES, filterByRange, getAverageValue, getUnitKey, statConverter } from '@stat/statHelpers'
import { Stat, StatName, StatRange } from '@stat/statInterface'
import { getActionIconSource, getStatQualIconSource } from '@utils/ui'
//store & queries
import { useGetStatByPet } from '@stat/statQueries'
import { useDisplayUnits } from '@store/store'
//components
import Loader from '@components/Loader'
import ToggleableForm from '@components/ToggleableForm'
import { CircleIcon, ErrorImage, FormHeader, ScrollScreen } from '@components/UIComponents'
//styles
import LineChart from '@components/Charts/LineChart'
import { Colors, Spacing, Typography, UI } from '@styles/index'

interface StatDetailsProps {
  navigation: any
  route: { params: { stat: StatName, petId: string } }
}

function useFilteredStat(records: Stat['records'], selectedRange: StatRange, startDate: string) {
  const stat = useMemo(() => {
    if (selectedRange === 'All') return {filtered: records, endDate: null}
    const { filtered, endDate } = filterByRange(selectedRange, records, startDate)
    return { filtered, endDate: endDate.toDateString().slice(4) }
  }, [records, selectedRange, startDate])
  const avgValue = getAverageValue(stat.filtered.map(r => r.value))
  const avg = Number.isNaN(Number(avgValue)) ? '0' : avgValue
  return { filtered: stat.filtered, avg, endDate: stat.endDate }
}

const StatDetails: FC<StatDetailsProps> = ({ navigation, route }) => {
  const { petId, stat: statName } = route.params
  const { data: stat, isSuccess, isFetching, isError } = useGetStatByPet(petId, statName)
  const records = useMemo(() => [...(stat?.records || [])].reverse(), [stat])

  const displayUnits = useDisplayUnits()
  const unit = displayUnits[getUnitKey(statName)]
  const defaultUnit = STATS[statName].unit
  const ranges = TIME_RANGES
  const chartType = STATS[statName].chart

  const [selectedRange, setSelectedRange] = useState<StatRange>('All')
  const [startDate, setStartDate] = useState(new Date())

  const { filtered, avg, endDate } = useFilteredStat(records, selectedRange, startDate.toISOString())

  return (
    <ScrollScreen>
      <CircleIcon type='stat' name={statName} />
      <FormHeader title={STATS[statName].name} />
      {filtered.length > 0 && 
        <ToggleableForm title='See graph'>
          <LineChart data={filtered} lineColor={Colors.pink.dark} />
        </ToggleableForm>
      }
      { isFetching && <Loader /> }
      { isError && <ErrorImage /> }
      { isSuccess && <>
        <View style={styles.filterBtnCon}>
          { ranges.map((range, index) =>
            <Pressable key={range} onPress={() => setSelectedRange(range)}>
              <Text style={[selectedRange === range ? Typography.focused : Typography.unFocused, { fontSize: 15 }]}>{range}</Text>
            </Pressable>
          ) }
        </View>

        <View style={styles.rangeCon}>
          <View style={styles.dateRangeCon}>
            <View style={styles.endDate}>
              <Text style={[{ fontSize: 17 }, !endDate && { ...Typography.unFocused, fontStyle: 'italic' }]}>{ endDate ?? 'M D Y' }</Text>
            </View>
            <Text> - </Text>
            <RNDateTimePicker value={startDate} themeVariant='light' accentColor={Colors.pink.darkest} maximumDate={new Date()} 
              onChange={ (_, selectedDate) => setStartDate(selectedDate)} />
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
            <Text>{STATS[statName].name}{unit && <Text> ({unit})</Text>}</Text>
          </View>
        </View>

        { filtered.length > 0 ? filtered.map((record, index) =>
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
          ) : <Text style={Typography.smallSubHeader}>No records</Text>
        }
      </> }

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
