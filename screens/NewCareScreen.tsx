
//npm
import { useEffect, useState } from "react"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
//components
import CareForm from "../components/CareForm"
//services
import { Care } from "../services/careService"
import * as careService from '../services/careService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'


const NewCareScreen: React.FC = ({ navigation, setCareCards, careCards }) => {

  const addCare = async (name: string, frequency: string, times: number, pets: string[]) => {
    const newCareCard = await careService.create(name, frequency, times, pets)
    return newCareCard
  }

  const handleSubmit = async (name: string, frequency: string, times: number, pets: string[]) => {
    const result = await addCare(name, frequency, times, pets)
    console.log('result', result)

    if (result && result.error) {
      alert(result.msg)
    } 
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <CareForm onSubmit={handleSubmit} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.subButton}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>  
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered
  },
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  },
  subBtn: {
    ...Buttons.smallSub
  },
})

export default NewCareScreen