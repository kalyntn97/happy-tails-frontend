import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
//components
import { ActionButton, CloseButton } from '@components/ButtonComponents'
import PlaceHolder from '@components/PlaceHolder'
import { ErrorImage, ScrollScreen, TitleLabel, TopRightHeader } from '@components/UIComponents'
//utils & types
import { DetailType, Id, Service } from '@pet/PetInterface'
import { PET_DETAILS } from '@pet/petHelpers'
import { useDeletePetDetail, useGetPetById } from '@pet/petQueries'
import { getActionIconSource, getPetIconSource } from '@utils/ui'
//styles
import Loader from '@components/Loader'
import { CustomToast } from '@navigation/NavigationStyles'
import { Colors, Spacing, Typography, UI } from '@styles/index'


interface MorePetDetailsScreenProps {
  route: { params: { petId: string, show?: DetailType } }
  navigation: any
}

type ListHeaderProps = {
  name: string
  onPress: () => void
}

const ListHeader = ({ name, onPress }: ListHeaderProps) => (
  <>
    <View style={styles.listHeaderLeft}>
      <Image source={getActionIconSource(name)} style={{ ...UI.icon() }} />
      <Text style={styles.listHeaderText}>{PET_DETAILS[name]}</Text>
    </View>
    <TopRightHeader label='Add' icon='add' onPress={onPress} />
  </>
)

const IdDetails = ({ id }: { id: Id }) => ( 
  <View>
    <Text style={styles.itemBody}>No: {id.no}</Text>
    { id.notes && <Text style={styles.itemFooter}>Notes: {id.notes}</Text> }
  </View>
)

const ServiceDetails = ({ service }: { service: Service }) => (
  <View>
    { service.addresses && service.addresses.map((address, idx) =>
      <Text key={`address-${idx}`} style={styles.itemBody}>Address{idx > 0 ? ` ${idx + 1}` : ''}: {address}</Text> 
    )}
    { service.emails && service.emails.map((email, idx) => 
      <Text key={`email-${idx}`} style={styles.itemBody}>Email{idx > 0 ? ` ${idx + 1}` : ''}: {email}</Text> 
    )}
    { service.phones && service.phones.length > 0 && service.phones.map((phone, idx) =>
      <Text key={`phone-${idx}`} style={styles.itemBody}>Phone{idx > 0 ? ` ${idx + 1}` : ''}: {phone}</Text>
    ) }
    { service.notes && <Text style={styles.itemFooter}>Notes: {service.notes}</Text> }
  </View>
)
const MorePetDetailsScreen = ({ navigation, route }: MorePetDetailsScreenProps) => {
  const { petId, show } = route.params
  
  const { data: pet, isSuccess, isFetching, isError } = useGetPetById(petId)
  
  const { handleDeletePetDetail, isPending } = useDeletePetDetail(petId, navigation)

  const detailData = {
    id: pet?.ids ?? [],
    service: pet?.services ?? [],
    medication: pet?.medications ?? [],
    condition: pet?.healthConditions ?? [],
    allergy: pet?.allergies ?? [],
  }

  const openForm = (type: DetailType) => {
    navigation.navigate('PetEditDetails', { type, petId })
  }

  const Item = ({ item, type }: { item: any, type: DetailType }) => (
    <View style={styles.itemCon}>
      <View style={Spacing.flexRow}>
        <Image source={getPetIconSource(item.type) || getPetIconSource(type)} style={UI.icon()} />
        <Text style={styles.itemHeader}>
          {item.name}
          <Text style={{ ...Typography.smallSubHeader }}> - {item.type}</Text>
        </Text>
      </View>
      {type === 'id' ? <IdDetails id={item} />
        : type === 'service' ? <ServiceDetails service={item} />
        : null
      }
      <CloseButton onPress={() => handleDeletePetDetail(type, item)} />
    </View>
  )

  return (
    <ScrollScreen>
      { isFetching && <Loader /> }
      { isError && <ErrorImage /> }
      { isSuccess && 
        pet && Object.keys(detailData).map((type: DetailType) =>
          (type === show) && 
            <View key={`${type}-details`} style={styles.sectionCon}>
              {/* <ListHeader name={type} onPress={() => openForm(type)} /> */}
              <TitleLabel mode='bold' title={PET_DETAILS[type]} iconName={type} size='large' rightAction={
                <ActionButton title='Add' onPress={() => openForm(type)} textStyles={{ ...Typography.smallHeader, margin: 0 }} size='small' />
              } />
              { detailData[type].length > 0 ? detailData[type].map((item: any, index: number) => 
                <Item key={`${type}-${index}`} item={item} type={type} />
              ) : <PlaceHolder type={type} petId={petId} /> }
            </View>
        )
      }
      <CustomToast />
    </ScrollScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    minHeight: '100%',
  },
  sectionCon: {
    width: '90%', 
    marginBottom: 40,
  },
  listHeaderLeft: {
    ...Spacing.flexRow, 
    marginTop: 50,
  },
  listHeaderText: {
    ...Typography.smallHeader, 
    marginLeft: 10,
  },
  itemHeader: {
    ...Typography.smallHeader, 
  },
  itemBody: {
    ...Typography.regBody,
    marginVertical: 5, 
    letterSpacing: 1,
    marginLeft: 20,
  },
  itemFooter: {
    ...Typography.smallSubBody,
    marginLeft: 20,
  },
  itemCon: {
    width: '100%',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: Colors.shadow.reg,
    paddingVertical: 10,
  },
  empty: {
    ...Typography.smallSubHeader,
    margin: 0
  }
})

export default MorePetDetailsScreen