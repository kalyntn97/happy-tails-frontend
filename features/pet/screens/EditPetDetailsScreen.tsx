import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native'
import React, { FC, useState } from 'react'
//components
import IdForm from '@pet/components/IdForm'
import { CloseButton, MainButton } from '@components/ButtonComponent'
//utils & types
import { Id, Medication } from '@pet/PetInterface'
import { getActionIconSource, getPetIconSource } from '@utils/ui'
//styles
import { Colors, Forms, Spacing, Typography } from '@styles/index'
import { BoxWithHeader } from '@components/HeaderComponent'
import MedicationForm from '@pet/components/MedicationForm'

interface EditPetDetailsScreenProps {

}

const EditPetDetailsScreen: FC<EditPetDetailsScreenProps> = ({}) => {
  const [ids, setIds] = useState<Id[]>([])
  const [showIdForm, setShowIdForm] = useState<boolean>(true)
  const [medications, setMedications] = useState<Medication[]>([])
  const [showMedForm, setShowMedForm] = useState<boolean>(true)

  const handleSaveId = (idFormData: Id) => {
    setIds(prev => [...prev, idFormData])
    setShowIdForm(false)
  }

  const handleRemoveId = (idFormData: Id) => {
    setIds(prev => prev.filter(i => i.name !== idFormData.name))
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formHeaderCon}>
        <Text style={{ ...Typography.xSmallHeader, margin: 0 }}>Pet identifications</Text>
        <Pressable onPress={() => setShowIdForm(!showIdForm)}>
          <Image source={getActionIconSource(showIdForm ? 'hide' : 'show')} style={{ ... Forms.smallIcon }} />
        </Pressable>
      </View>
      {ids.map((id, index) =>
        <View key={`id-${index}`} style={styles.itemCon}>
          <View style={{ ...Spacing.flexRow }}>
            <Image source={getPetIconSource(id.name) || getPetIconSource('Id')} style={{ ...Forms.smallIcon }} />
            <Text style={styles.itemHeader}>
              {id.name}
              <Text style={{ ...Typography.xSmallSubHeader }}> - {id.registry}</Text>
            </Text>
          </View>
          <Text style={styles.itemBody}>No: {id.no}</Text>
          <Text style={styles.itemFooter}>Notes: {id.notes}</Text>
          <CloseButton size='small' position='topRight' onPress={() => handleRemoveId(id)} />
        </View>
      )}
      {showIdForm && <IdForm onSave={handleSaveId} onHide={() => setShowIdForm(false)}/>}

      <View style={styles.formHeaderCon}>
        <Text style={{ ...Typography.xSmallHeader, margin: 0 }}>Medications</Text>
        <Pressable onPress={() => setShowMedForm(true)}>
          <Image source={getActionIconSource('add')} style={{ ... Forms.smallIcon }} />
        </Pressable>
      </View>
      {showMedForm && <MedicationForm />}

      <MainButton title='Save' top='auto' />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    width: '100%',
    paddingBottom: 20,
  },
  formHeaderCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  itemHeader: {
    ...Typography.xSmallHeader, 
    margin: 0,
    marginLeft: 5,
  },
  itemBody: {
    ...Typography.smallBody,
    marginVertical: 5, 
    letterSpacing: 1,
    marginLeft: 20,
  },
  itemFooter: {
    ...Typography.xSmallSubBody,
    marginLeft: 20,
  },
  itemCon: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: Colors.shadow.reg,
    width: '90%',
    paddingVertical: 10,
  }
})

export default EditPetDetailsScreen