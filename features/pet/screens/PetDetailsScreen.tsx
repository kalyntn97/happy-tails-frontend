//npm modules
import { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, useWindowDimensions, Pressable, Image, Modal } from "react-native"
import { useQueryClient } from "@tanstack/react-query"
//types & context & hooks
import { Pet } from "@pet/PetInterface"
import { STATS } from "@stat/statHelpers"
import { showDeleteConfirmDialog } from "@hooks/sharedHooks"
//components
import PetInfo from "@components/PetInfo/PetInfo"
import Loader from "@components/Loader"
import {  BoxHeader, EmptyList, ErrorImage } from "@components/UIComponents"
import { getActionIconSource, getPetIconSource, getStatIconSource } from "@utils/ui"
import { ActionButton, CheckboxButton, CloseButton, IconButton, MainButton, SubButton, TransparentButton } from "@components/ButtonComponent"
//store & queries
import { petKeyFactory, useDeletePet, useGetPetById } from "@pet/petQueries"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'
import { PET_DETAILS } from "@pet/petHelpers"
import { useGetPetSettings, useSetActions } from "@store/store"

interface PetDetailsProps {
  navigation: any
  route: { params: { petId: string } }
}

const SectionHeader = ({ title, icon, onPress }: { title: string, icon: string, onPress?: () => void }) => (
  <View style={styles.sectionHeaderCon}>
    <Image source={getActionIconSource(icon)} style={{ ...Forms.smallIcon }} />
    <Text style={styles.sectionHeader}>{title}</Text>
    { onPress && <ActionButton title={'filter'} onPress={onPress} left='auto' /> }
  </View>
)

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  const defaultInfo = ['ids', 'services']
  const defaultLogs = ['mood', 'weight', 'energy']

  const queryClient = useQueryClient()
  const { petId } = route.params
  const petCache: Pet | undefined = queryClient.getQueryData(petKeyFactory.petById(petId))

  const infoSetting = useGetPetSettings(petId, 'info')
  const logsSetting = useGetPetSettings(petId, 'logs')
  const { setPetSettings } = useSetActions()

  const [modalVisible, setModalVisible] = useState(false)
  const [option, setOption] = useState<'info' | 'logs'>(null)
  const [info, setInfo] = useState<string[]>(infoSetting ?? defaultInfo)
  const [logs, setLogs] = useState<string[]>(logsSetting ?? defaultLogs)

  const {data: pet, isSuccess, isFetching, isError} = useGetPetById(petId, !petCache)
    
  const deletePetMutation = useDeletePet(navigation)
  const handleDeletePet = (petId: string) => {
    deletePetMutation.mutate(petId)
  }
  //header
  const getHeaderItems = (type: string) => type === 'logs' ? logs : info
  const getHeaderIconSource = (type: string, log: string) => type === 'logs' ? getStatIconSource(log) : getActionIconSource(log)
  const getHeaderName = (type: string, log: string) => type === 'logs' ? STATS[log].name : PET_DETAILS[log]
  //filter list
  const items = option === 'logs' ? Object.keys(STATS) : Object.keys(PET_DETAILS)
  const isActive = (type: string): Boolean => option === 'logs' ? logs.includes(type) : info.includes(type)
  const toggleItem = (type: string) => {
    if (option === 'logs') { 
      setLogs(prev => logs.includes(type) ? prev.filter(p => p !== type) : [...prev, type])
    } else {
      setInfo(prev => info.includes(type) ? prev.filter(p => p !== type) : [...prev, type])
    }
  }
  const getIconSource = (type: string) => option === 'logs' ? getStatIconSource(type) : getPetIconSource(type)
  const getItemName = (type: string) => option === 'logs' ? STATS[type].name : PET_DETAILS[type]

  const ViewHeader = ({ }) => (
    <View style={styles.conHeader}>
      <ActionButton title='search' size='small' />
      <ActionButton title='edit' size='small' onPress={() => navigation.navigate('Edit', { pet: pet })} />
      <ActionButton title='add' size='small' onPress={() => navigation.navigate('CreateLog', { pet: { _id: pet._id, name: pet.name } })} />
    </View>
  )

  useEffect(() => {
    if (!modalVisible) {
      const timeout = setTimeout(() => {
        setPetSettings(petId, option, option === 'info' ? info : logs)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [modalVisible, info, logs]);

  return (    
    <View style={pet?.color && { backgroundColor: Colors.multi.lightest[pet.color] }}>
      <ViewHeader />
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={styles.container}
      >  
        { isError && <ErrorImage /> }
        { isFetching && <Loader /> }
        
        { isSuccess && <>
          <View style={[styles.infoCard,]}>
            <PetInfo pet={pet} size='expanded' />
          </View>

          { ['info', 'logs'].map((type: 'info' | 'logs') => 
            <View key={type} style={{ ...Spacing.flexColumn, width: '100%' }}>
              <SectionHeader title={type === 'info' ? "Important" : 'Logs'} icon={type === 'info' ? 'saveSquare' : 'chart'} onPress={() => {
                setModalVisible(true)
                setOption(type)
              }} />
              <View style={{ ...Forms.roundedCon, ...Spacing.flexColumn }}>
                { getHeaderItems(type).length > 0 ? getHeaderItems(type).map(log => <BoxHeader key={log} mode='light' title={getHeaderName(type, log)} titleIconSource={getHeaderIconSource(type, log)} />) 
                  : <TransparentButton title='Reset' onPress={() => type === 'info' ? setInfo(defaultInfo) : setLogs(defaultLogs)} />
                } 
              </View>
            </View>
          ) } 
            
          <SectionHeader title='Actions' icon='actionSquare' />
          <View style={{ ...Forms.roundedCon }}>
            <BoxHeader title='Log pet stats' titleIconSource={getActionIconSource('log')} mode='light' onPress={() => navigation.navigate('CreateLog', { pet: { _id: pet._id, name: pet.name } })} />
            <BoxHeader title="Update pet info" titleIconSource={getActionIconSource('editSquare')} mode='light' onPress={() => navigation.navigate('Edit', { pet: pet })} />
            <BoxHeader title={deletePetMutation.isPending ? 'Deleting...' : 'Delete pet profile'} titleIconSource={getActionIconSource('deleteSquare')} onPress={() => showDeleteConfirmDialog(pet, handleDeletePet)} titleColor={Colors.red.dark} />
          </View>
        </>}
      </ScrollView>

      <Modal 
        animationType='slide'
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onDismiss={() => {
          setPetSettings(petId, option, option === 'info' ? info : logs)
          setOption(null)
        }}
        transparent={true}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={{ ...Forms.modal }}>
          <View style={styles.modalCon}>
            <View style={{ ...Spacing.flexRow }}>
              <Text style={{ ...Typography.smallHeader }}>{option === 'info' ? 'Show Pet Details' : 'Show Pet Logs'}</Text>
              <Image source={getActionIconSource('filter')} style={{ ...Forms.smallIcon }} />
            </View>
            <View style={styles.modalBody}>
              { items.map((type: string, index: number) => 
                <Pressable key={`${type}-${index}`} style={[styles.itemCon, isActive(type) ? { ...Forms.active } : { ...Forms.inactive }]} onPress={() => toggleItem(type)}>
                  <Image source={getIconSource(type)} style={{ ...Forms.largeIcon }}/>
                  <Text style={{ ...Typography.xSmallHeader, margin: 0 }}>{getItemName(type)}</Text>
                </Pressable>
              ) }
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    paddingBottom: 100,
  },
  conHeader: {
    ...Spacing.flexRow, 
    marginLeft: 'auto', 
    paddingTop: 50, 
    marginRight: 10,
    paddingBottom: 10,
    width: '40%', 
    justifyContent: 'space-between', 
  },
  infoCard: {
    width: '90%',
    height: 290,
    ...Forms.card,
    justifyContent: 'flex-start',
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    ...Typography.xSmallHeader,
    marginVertical: 0,
    marginLeft: 10,
  },
  sectionHeaderCon: {
    ...Spacing.flexRow,
    width: '90%',
    marginBottom: 0,
    marginTop: 10,
  },
  itemCon: {
    ...Spacing.flexColumn,
    margin: 20,
  },
  modalCon: {
    width: '100%',
    height: '80%',
    marginTop: 'auto',
    padding: 20,
    backgroundColor: Colors.shadow.lightest,
    ...Forms.topRounded,
    ...Spacing.flexColumn,
    ...Forms.boxShadow,
  },
  modalBody: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    flexWrap: 'wrap',
  },
})

export default PetDetailsScreen