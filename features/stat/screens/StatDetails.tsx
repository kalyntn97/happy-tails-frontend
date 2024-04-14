import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useState } from 'react'
//helpers & types
import { Stat } from '@stat/statInterface'
import { getActionIconSource, getStatIconSource, getStatQualIconSource } from '@utils/ui'
import { CHART_PARAMS, STATS, filterByRange, getUnitKey, statConverter } from '@stat/statHelpers'
//store & queries
import { useDisplayUnits } from '@store/store'
//styles
import { Typography, Forms, Spacing, Colors } from '@styles/index'
import ToggleableForm from '@components/ToggleableForm'

interface StatDetailsProps {
  navigation: any
  route: { params: { stat: Stat }}
}

const StatDetails: FC<StatDetailsProps> = ({ navigation, route }) => {
  const { stat } = route.params
  const name = STATS[stat.name].name
  const records = [...stat.records].reverse()
  const ranges = CHART_PARAMS.range
  const [selectedRange, setSelectedRange] = useState('All')
  const [filtered, setFiltered] = useState(records)
  const displayUnits = useDisplayUnits()
  const unit = displayUnits[getUnitKey(stat.name)]
  const defaultUnit = STATS[stat.name].unit

  const changeRange = (range: string) => {
    setSelectedRange(range)
    setFiltered(filterByRange(range, records))
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ ...Forms.roundedIconCon }}>
        <Image source={getStatIconSource(stat.name)} style={{ ...Forms.largeIcon }}/>
      </View>
      <Text style={{ ...Typography.mediumHeader }}>{name}</Text>

      <View style={styles.filterBtnCon}>
        {CHART_PARAMS.range.map((range, index) =>
          <Pressable key={range} onPress={() => changeRange(range)}>
            <Text style={selectedRange === range ? Typography.focused : Typography.unFocused}>{range}</Text>
          </Pressable>
        )}
      </View>

      <ToggleableForm title='See graph' content={
        <Text>This is a graph</Text>
      } 
      />

      <View style={[styles.rowCon, styles.tableHeaderCon]}>
        <View style={[styles.columnCon, styles.leftColumn]}>
          <Image source={getActionIconSource('date')} style={{ ...Forms.smallIcon, marginRight: 10 }} />
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
            {unit && <Text style={styles.column}>{unit === defaultUnit ? record.value : statConverter(stat.name, record.value.toString(), unit)}</Text> }
            {stat.name === 'mood' && <Image source={getStatQualIconSource(stat.name, record.value)} style={{ ...Forms.icon }} /> }
            
          </View>
        </View>
      )}

    </ScrollView>
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
    ...Spacing.flexRow,
    width: '70%',
    justifyContent: 'space-evenly',
    borderRadius: 15,
    // borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.white,
  }, 
})

export default StatDetails
