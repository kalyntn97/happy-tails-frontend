//npm
import { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native"
//services
import { Care } from "../services/careService"
import * as careService from '../services/careService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CareDetailsProps {
  navigation: any
  route: { params: { careId: string }}
}

const CareDetailsScreen = ({ navigation, route }) => {
  const [careCard, setCareCard] = useState<Care>({
    _id: '',
    name: '',
    frequency: 'daily',
    times: 0,
    pets: [],
    trackers: []
  })

  const { careId } = route.params

  useEffect(() => {
    const fetchCareDetails =async () => {
      const data = await careService.show(careId)
      setCareCard(data)
      console.log(careCard)
    }
    fetchCareDetails()
  }, [careId])

  const handleDeleteCareCard = async (careId: string) => {
    const deletedCareCard = await careService.deleteCareCard(careId)
    navigation.navigate('Index', { careId: deletedCareCard._id })
  }

  const showDeleteConfirmDialog = () => {
    return Alert.alert(
      'Are you sure?',
      `Remove ${careCard.name} Tracker ?`, 
      [
        { text: 'Yes', onPress: () => { handleDeleteCareCard(careId) }},
        { text: 'No' }
      ]
    )
  }

  return (  
    <View style={styles.container}>
      <Text>{careCard.name}</Text>
      <TouchableOpacity onPress={showDeleteConfirmDialog}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
})

export default CareDetailsScreen