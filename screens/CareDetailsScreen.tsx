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
    const fetchCareDetails = async () => {
      const data = await careService.show(careId)
      setCareCard(data)
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
      <Text style={styles.header}>{careCard.name}</Text>
      <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Go back</Text>
      </TouchableOpacity>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.yellow }]} onPress={() => navigation.navigate('Edit', { care: careCard })}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.red }]} onPress={showDeleteConfirmDialog}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
  },
  header: {
    ...Typography.subHeader,
    color: Colors.darkPink,
    marginTop: 40,
    marginBottom: 0
  },
  btnContainer: {
    ...Spacing.flexRow,
    marginVertical: 10
  },
  mainBtn: {
    ...Buttons.xSmallSquare
  },
  subBtn: {
    ...Buttons.smallSub,
  },
  btnText: {
    ...Buttons.buttonText
  }
})

export default CareDetailsScreen