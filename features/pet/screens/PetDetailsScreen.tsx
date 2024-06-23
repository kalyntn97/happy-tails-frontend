//npm modules
import { useEffect, useState } from "react"
import { StyleSheet, View, Text, ScrollView, Pressable, Image, Modal } from "react-native"
import { useQueryClient } from "@tanstack/react-query"
//types & context & hooks
import { Pet } from "@pet/PetInterface"
import { STATS } from "@stat/statHelpers"
import { PET_DETAILS } from "@pet/petHelpers"
import { showDeleteConfirmDialog } from "@hooks/sharedHooks"
//components
import PetInfo from "@components/PetInfo/PetInfo"
import Loader from "@components/Loader"
import {  BoxHeader, EmptyList, ErrorImage } from "@components/UIComponents"
import { getActionIconSource, getPetIconSource, getStatIconSource } from "@utils/ui"
import { ActionButton, TransparentButton } from "@components/ButtonComponent"
//store & queries
import { petKeyFactory, useDeletePet, useGetPetById } from "@pet/petQueries"
import { useGetPetSettings, useSetActions } from "@store/store"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'

interface PetDetailsProps {
  navigation: any
  route: { params: { petId: string } }
}

type SectionType = 'info' | 'logs' | 'actions'

const SectionHeader = ({ type, onPress }: { type: SectionType, onPress?: () => void }) => {
  const title = type === 'info' ? "Important" : type === 'logs' ? 'Logs' : 'Actions'
  const icon = type === 'info' ? 'saveSquare' : type === 'logs' ? 'chart' : 'actionSquare'

  return (
    <View style={styles.sectionHeaderCon}>
      <Image source={getActionIconSource(icon)} style={{ ...Forms.smallIcon }} />
      <Text style={styles.sectionHeader}>{title}</Text>
      { onPress && <ActionButton title={'filter'} onPress={onPress} left='auto' /> }
    </View>
  )
}

const ItemHeaderList= ({ type, logs, info, onPress }: { type: SectionType, logs: string[], info: string[], onPress: () => void }) => {
  const getHeader = () => ({
    key: (log: string) => log,
    titles: () => type === 'logs' ? logs : info, 
    getIcon: (log: string) => type === 'logs' ? getStatIconSource(log) : getActionIconSource(log), 
    getName: (log: string) => type === 'logs' ? STATS[log].name : PET_DETAILS[log]
  })
  const header = getHeader()
  const titles = header.titles()

  return (
    titles.length > 0 ? titles.map(log =>
      <BoxHeader key={header.key(log)} title={header.getName(log)} titleIconSource={header.getIcon(log)} mode='light' />
    ) : <TransparentButton title='Reset' onPress={onPress} />
  )
}

const ModalItem = ({ type, option, logs, info, onPress }: { type: string, option: SectionType, logs: string[], info: string[], onPress: () => void }) => {
  const getItem = () => ({
    key: type,
    isActive: () => option === 'logs' ? logs.includes(type) : info.includes(type),
    getIcon: () => option === 'logs' ? getStatIconSource(type) : getPetIconSource(type),
    getName:() => option === 'logs' ? STATS[type].name : PET_DETAILS[type]
  })
  const item = getItem()

  return (
    <Pressable style={[styles.itemCon, item.isActive() ? { ...Forms.active } : { ...Forms.inactive }]} onPress={onPress}>
      <Image source={item.getIcon()} style={{ ...Forms.largeIcon }}/>
      <Text style={{ ...Typography.xSmallHeader, margin: 0 }}>{item.getName()}</Text>
    </Pressable>
  ) 
}

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  const queryClient = useQueryClient()
  const { petId } = route.params
  const petCache: Pet | undefined = queryClient.getQueryData(petKeyFactory.petById(petId))
  const {data: pet, isSuccess, isFetching, isError} = useGetPetById(petId, !petCache)

  const infoSetting = useGetPetSettings(petId, 'info')
  const logsSetting = useGetPetSettings(petId, 'logs')
  const { setPetSettings } = useSetActions()

  const defaultInfo = ['ids', 'services']
  const defaultLogs = ['mood', 'weight', 'energy']

  const [modalVisible, setModalVisible] = useState(false)
  const [option, setOption] = useState<SectionType>(null)
  const [info, setInfo] = useState<string[]>(infoSetting ?? defaultInfo)
  const [logs, setLogs] = useState<string[]>(logsSetting ?? defaultLogs)

  const deletePetMutation = useDeletePet(navigation)

  const handleDeletePet = (petId: string) => {
    deletePetMutation.mutate(petId)
  }
  //filter list
  const items = option === 'logs' ? Object.keys(STATS) : Object.keys(PET_DETAILS)

  const toggleItem = (type: string) => {
    if (option === 'logs') { 
      setLogs(prev => logs.includes(type) ? prev.filter(p => p !== type) : [...prev, type])
    } else {
      setInfo(prev => info.includes(type) ? prev.filter(p => p !== type) : [...prev, type])
    }
  }

  const handleReset = (type: SectionType) => type === 'info' ? setInfo(defaultInfo) : setLogs(defaultLogs)

  const bottomActions = [
    { key: 'log', title: 'Log pet stats', icon: 'log', onPress: () => navigation.navigate('CreateLog', { pet: { _id: pet._id, name: pet.name } }) },
    { key: 'edit', title: 'Update pet info', icon: 'editSquare', onPress: () => navigation.navigate('Edit', { pet: pet }) },
    { key: 'delete', title: deletePetMutation.isPending ? 'Deleting...' : 'Delete pet profile', icon: 'deleteSquare', onPress: () => showDeleteConfirmDialog(pet, handleDeletePet) },
  ]

  const topActions = [
    { key: 'search' },
    { key: 'edit', onPress: () => navigation.navigate('Edit', { pet: pet }) },
    { key: 'add', onPress:() => navigation.navigate('CreateLog', { pet: { _id: pet._id, name: pet.name } }) },
  ]

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
      <View style={styles.conHeader}>
        { topActions.map(action => <ActionButton key={action.key} title={action.key} onPress={action.onPress} />) }
      </View>

      <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.container}>  
        { isError && <ErrorImage /> }
        { isFetching && <Loader /> }
        
        { isSuccess && <>
          <View style={styles.infoCard}>
            <PetInfo pet={pet} size='expanded' />
          </View>

          { ['info', 'logs'].map((type: SectionType) =>
            <View key={type} style={{ ...Spacing.flexColumn, width: '100%' }}>
              <SectionHeader type={type} onPress={() => {
                setModalVisible(true)
                setOption(type)
              }} />
              <View style={{ ...Forms.roundedCon, ...Spacing.flexColumn }}>
                <ItemHeaderList type={type} logs={logs} info={info} onPress={() => handleReset(type)} />
              </View>
            </View>
          ) } 
            
          <SectionHeader type='actions' />
          <View style={{ ...Forms.roundedCon }}>
            { bottomActions.map(action => <BoxHeader key={action.key} title={action.title} titleIconSource={getActionIconSource(action.icon)} onPress={action.onPress} titleColor={action.key === 'delete' && Colors.red.darkest} />) }
          </View>

        </> }
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
              { items.map((type: string, index: number) => <ModalItem key={`${type}-${index}`} type={type} option={option} logs={logs} info={info} onPress={() => toggleItem(type)} />) }
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
    ...Forms.card,
    width: '90%',
    height: 290,
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
    ...Spacing.flexColumn,
    width: '100%',
    height: '80%',
    marginTop: 'auto',
    padding: 20,
    backgroundColor: Colors.shadow.lightest,
    ...Forms.topRounded,
    ...Forms.boxShadow,
  },
  modalBody: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    flexWrap: 'wrap',
  },
})

export default PetDetailsScreen