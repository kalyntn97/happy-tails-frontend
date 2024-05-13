import { StyleSheet, Text, View, Image, Pressable, ScrollView, Modal } from 'react-native'
import React, { FC, useState } from 'react'
//components
import IdForm from '@pet/components/IdForm'
import { CloseButton, MainButton } from '@components/ButtonComponent'
//utils & types
import { Id, Medication, Pet, Service } from '@pet/PetInterface'
import { AlertForm, getActionIconSource, getPetIconSource } from '@utils/ui'
//styles
import { Colors, Forms, Spacing, Typography } from '@styles/index'
import { BoxWithHeader } from '@components/UIComponents'
import MedicationForm from '@pet/components/MedicationForm'
import CareForm from '@care/components/CareForm'
import IllnessForm from '@pet/components/IllnessForm'
import ServiceForm from '@pet/components/ServiceForm'
import { useDeleteId, useDeleteIllness, useDeletePetDetail, useDeleteService, useGetPetById } from '@pet/petQueries'
import { PET_DETAILS } from '@pet/petHelpers'
import Loader from '@components/Loader'

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
  const {data: pet, isSuccess, isLoading, isError} = useGetPetById(route.params.pet._id, route.params.pet)
  const { ids, medications, illnesses, services, _id: petId } = pet
  const { show } = route.params

  const detailData = {
    id: ids,
    med: medications,
    illness: illnesses,
    service: services,
  }

  const openForm = (form: string) => {
    navigation.navigate('EditDetails', { form, petId })
  }

  const DetailSections = () => {
    const detailItems = []
    for (const key in PET_DETAILS) {
      detailItems.push(
        (!show || show === key) && 
          <View key={`${key}-details`} style={{ width: '90%' }}>
            <ListHeader name={key} onPress={() => openForm(key)} />
            {detailData[key]?.length ? 
              detailData[key].map((item: any, index: number) => <Item key={`${key}-${index}`} item={item} type={key} />) 
              : <EmptyList />
            }
          </View>
      )
    }
    return detailItems
  }

  const deleteDetailMutation = useDeletePetDetail(petId)

  const IdDetails = ({ id }: { id: Id }) => ( 
    <View>
      <Text style={styles.itemBody}>No: {id.no}</Text>
      {id.notes && <Text style={styles.itemFooter}>Notes: {id.notes}</Text>}
    </View>
  )

  const ServiceDetails = ({ service }: { service: Service }) => (
    <View>
      {service.address && <Text style={styles.itemBody}>Address: {service.address}</Text>}
      {service.email && <Text style={styles.itemBody}>Email: {service.email}</Text>}
      {service.phones && service.phones.length > 0 && service.phones.map(phone =>
        <Text style={styles.itemBody}>Phone: {phone}</Text>
      )}
      {service.notes && <Text style={styles.itemFooter}>Notes: {service.notes}</Text>}
    </View>
  )
  
  const Item = ({ item, type }) => (
    <View style={styles.itemCon}>
      <View style={{ ...Spacing.flexRow }}>
        <Image source={getPetIconSource(item.type) || getPetIconSource(type)} style={{ ...Forms.smallIcon }} />
        <Text style={styles.itemHeader}>
          {item.name}
          <Text style={{ ...Typography.xSmallSubHeader }}> - {item.type}</Text>
        </Text>
      </View>
      {type === 'id' ? <IdDetails id={item} />
        : type === 'service' ? <ServiceDetails service={item} />
        : null
      }
      <CloseButton size='small' position='topRight' onPress={() => deleteDetailMutation.mutate({ key: type, detailId: item._id })} />
    </View>
  )

  return (
    <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
      { isLoading && <Loader /> }
      { isError && <Text>Error fetching pet details...</Text> }
      { isSuccess && <DetailSections /> }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  listHeaderCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: '100%',
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
    width: '100%',
    paddingVertical: 10,
  },
})

export default MorePetDetailsScreen