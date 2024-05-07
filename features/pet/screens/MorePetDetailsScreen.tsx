import { StyleSheet, Text, View, Image, Pressable, ScrollView, Modal } from 'react-native'
import React, { FC, useState } from 'react'
//components
import IdForm from '@pet/components/IdForm'
import { CloseButton, MainButton } from '@components/ButtonComponent'
//utils & types
import { Id, Medication, Pet } from '@pet/PetInterface'
import { AlertForm, getActionIconSource, getPetIconSource } from '@utils/ui'
//styles
import { Colors, Forms, Spacing, Typography } from '@styles/index'
import { BoxWithHeader } from '@components/UIComponents'
import MedicationForm from '@pet/components/MedicationForm'
import CareForm from '@care/components/CareForm'
import DiseaseForm from '@pet/components/DiseaseForm'
import ServiceForm from '@pet/components/ServiceForm'
import { useDeleteId } from '@pet/petQueries'
import { PET_DETAILS } from '@pet/petHelpers'

interface EditPetDetailsScreenProps {
  route: { params: { pet: Pet, show?: string }}
  navigation: any
}

const ListHeader = ({ name, onPress }) => (
  <View style={styles.listHeaderCon}>
    <View style={{ ...Spacing.flexRow }}>
      <Image source={getActionIconSource(name)} style={{ ...Forms.smallIcon }} />
      <Text style={styles.listHeaderText}>{PET_DETAILS[name]}</Text>
    </View>
    <Pressable onPress={onPress}>
      <Image source={getActionIconSource('add')} style={{ ... Forms.smallIcon }} />
    </Pressable>
  </View>
)

const EmptyList = () => (
  <View>
    <Text>No item added.</Text>
  </View>
)

const MorePetDetailsScreen: FC<EditPetDetailsScreenProps> = ({ navigation, route }) => {
  const { ids, medications, diseases, services, _id: petId } = route.params.pet
  const { show } = route.params

  const detailData = {
    id: ids,
    med: medications,
    disease: diseases,
    service: services,
  }

  const openForm = (form: string) => {
    navigation.navigate('Edit', { form, petId })
  }

  const DetailSections = () => {
    const detailItems = []
    for (const key in PET_DETAILS) {
      detailItems.push(
        (!show || show === key) && <>
          <ListHeader name={key} onPress={() => openForm(key)} />
          {detailData[key].length ? 
            detailData[key].map((item: any, index: number) =>
              key === 'id' && <IdItem id={item} key={`id-${index}`} />
            ) : <EmptyList />
          }
        </>
      )
    }
    return detailItems
  }

  const deleteIdMutation = useDeleteId(petId)

  const handleDelete = (type: string, id: string) => {
    switch (type) {
      case 'id': deleteIdMutation.mutate({ petId, idId: id}, {
        onSuccess: () => {
          return AlertForm({ body: 'Id deleted successfully', button: 'OK' })
        },
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      })
    }
  }

  const IdItem = ({ id }) => ( 
    <View style={styles.itemCon}>
      <View style={{ ...Spacing.flexRow }}>
        <Image source={getPetIconSource(id.name) || getPetIconSource('Id')} style={{ ...Forms.smallIcon }} />
        <Text style={styles.itemHeader}>
          {id.registry}
          <Text style={{ ...Typography.xSmallSubHeader }}> - {id.name}</Text>
        </Text>
      </View>
      <Text style={styles.itemBody}>No: {id.no}</Text>
      <Text style={styles.itemFooter}>Notes: {id.notes}</Text>
      <CloseButton size='small' position='topRight' onPress={() => handleDelete('id', id._id)} />
    </View>
  )
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DetailSections />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    width: '100%',
    paddingBottom: 20,
  },
  listHeaderCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
    marginBottom: 10,
  },
  listHeaderText: {
    ...Typography.xSmallHeader, 
    marginVertical: 0,
    marginLeft: 10,
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
  },
})

export default MorePetDetailsScreen