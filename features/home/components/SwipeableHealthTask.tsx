//npm
import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
//types
import { Health } from '@health/HealthInterface'

interface SwipeableHealthTaskProps {
  health: Health
  navigation: any
}

const SwipeableHealthTask: FC<SwipeableHealthTaskProps> = ({ health, navigation }) => {
  return (
    <View>
      <Text>{health.name}</Text>
      {/* <Text>{new Date(health.lastDone[0]).toDateString()}</Text> */}
    </View>
  )
}


const styles = StyleSheet.create({
  
})

export default SwipeableHealthTask