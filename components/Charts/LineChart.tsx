import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Spacing } from '@styles/index'

type Props = {
  data: { value: number, createdAt: string }[]
}

const LineChart = () => {
  const data = [{ value: 2, createdAt: '2024-06-03' }, { value: 5, createdAt: '2024-05-03' }, { value: 4, createdAt: '2024-02-03' }]

  return (
    <View style={styles.container}>
      {data.map(record =>
        <View>
          <Text style={[{ position: 'absolute', bottom: record.value, left: new Date().getTime() - new Date(record.createdAt).getTime() }]}>●</Text>
        </View>
      )}
    </View>
  )
}

export default LineChart

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...Spacing.flexRow,
  },
})