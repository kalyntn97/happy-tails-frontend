import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
//styles
import Colors from '@styles/colors'

interface CustomHeaderProps {

}

const CustomHeader: FC<CustomHeaderProps> = ({ }) => {
  return (
    <View>
      <Text>CustomHeader</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.pink.reg
  }
})

export default CustomHeader