//npm modules
import { memo, useEffect, useMemo, useState } from "react"
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
import {  BoxHeader, EmptyList, ErrorImage, Icon, ModalInput } from "@components/UIComponents"
import { IconType, getActionIconSource, getPetIconSource, getStatIconSource } from "@utils/ui"
import { ActionButton, TransparentButton } from "@components/ButtonComponents"
//store & queries
import { petKeyFactory, useDeletePet, useGetPetById } from "@pet/petQueries"
import { useGetPetSettings, useSetActions } from "@store/store"
//styles
import { Buttons, Spacing, UI, Colors, Typography } from '@styles/index'
import StatButtonList from "@pet/components/StatButtonList"
import { GoBackButton } from "@components/ButtonComponents"

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
      <Icon name={icon} />
      <Text style={styles.sectionHeader}>{title}</Text>
      { onPress && <ActionButton icon={'filter'} onPress={onPress} buttonStyles={{ marginLeft: 'auto' }} /> }
    </View>
  )
}

const ItemHeaderList= memo(({ type, logs, info, navigation, onReset, petId }: { type: SectionType, logs: string[], info: string[], navigation: any, onReset: () => void, petId: string }) => {
  const header = useMemo(() => {
    const titles = type === 'logs' ? logs : info
    const iconType: IconType = type === 'logs' ? 'stat' : 'action'
    const getName =  (log: string) => type === 'logs' ? STATS[log].name : PET_DETAILS[log]
    const onNavigate = (log: string) => {
      switch(type) {
        case 'info': return navigation.navigate('PetMoreDetails', { petId, show: log })
        case 'logs': return navigation.navigate('LogDetails', { stat: log })
        default: return null
      }
    }
    return { titles, iconType, getName, onNavigate }
  }, [type, logs, info, petId, navigation])

  if (header.titles.length === 0 ) return <TransparentButton title='Reset' onPress={onReset} />

  return (
    header.titles.map(log =>
      <BoxHeader key={log} title={header.getName(log)} iconType={header.iconType} iconName={log} mode='light' onPress={() => header.onNavigate(log)} />
    )
  )
})

const ModalItem = ({ type, option, logs, info, onPress }: { type: string, option: SectionType, logs: string[], info: string[], onPress: () => void }) => {
  const getItem = () => ({
    key: type,
    isActive: () => option === 'logs' ? logs.includes(type) : info.includes(type),
    getIcon: () => option === 'logs' ? getStatIconSource(type) : getPetIconSource(type),
    getName:() => option === 'logs' ? STATS[type].name : PET_DETAILS[type]
  })
  const item = getItem()

  return (
    <Pressable style={[styles.itemCon, item.isActive() ? { ...UI.active } : { ...UI.inactive }]} onPress={onPress}>
      <Image source={item.getIcon()} style={{ ...UI.largeIcon }}/>
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
    { key: 'edit', title: 'Update pet info', icon: 'editSquare', onPress: () => navigation.navigate('PetEdit', { pet: pet }) },
    { key: 'delete', title: deletePetMutation.isPending ? 'Deleting...' : 'Delete pet profile', icon: 'deleteSquare', onPress: () => showDeleteConfirmDialog(pet, handleDeletePet) },
  ]

  const topActions = [
    { key: 'search' },
    { key: 'edit', onPress: () => navigation.navigate('PetEdit', { pet: pet }) },
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
    <View style={[Spacing.fullCon(), { backgroundColor: Colors.multi.lightest[pet?.color] }]}>
      <GoBackButton onPress={navigation.goBack} />
      <View style={styles.conHeader}>
        { topActions.map(action => <ActionButton key={action.key} icon={action.key} onPress={action.onPress} />) }
      </View>

      <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false} style={{ width: '100%' }} contentContainerStyle={UI.form(0, 60)}>  
        { isError && <ErrorImage /> }
        { isFetching && <Loader /> }
        
        { isSuccess && <>
          <View style={styles.infoCard}>
            <PetInfo pet={pet} size='large' />
            <StatButtonList petId={pet._id} petColor={pet.color} size='large' navigation={navigation} />
          </View>

          { ['info', 'logs'].map((type: SectionType) =>
            <View key={type}>
              <SectionHeader type={type} onPress={() => {
                setModalVisible(true)
                setOption(type)
              }} />
              <View style={UI.roundedCon}>
                <ItemHeaderList type={type} logs={logs} info={info} onReset={() => handleReset(type)} navigation={navigation} petId={petId} />
              </View>
            </View>
          ) } 
          
          <SectionHeader type='actions' />
          <View style={UI.roundedCon}>
            { bottomActions.map(action => <BoxHeader key={action.key} title={action.title} iconName={action.icon} onPress={action.onPress} color={action.key === 'delete' && Colors.red.dark} mode={action.key === 'delete' ? 'dark' : 'light'} />) }
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
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={{ ...UI.modalOverlay }}>
          <View style={styles.modalCon}>
            <View style={Spacing.flexRow}>
              <Text style={{ ...Typography.smallHeader }}>{option === 'info' ? 'Show Pet Details' : 'Show Pet Logs'}</Text>
              <Image source={getActionIconSource('filter')} style={{ ...UI.icon() }} />
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
  conHeader: {
    ...Spacing.flexRow, 
    marginLeft: 'auto', 
    paddingTop: 20, 
    paddingBottom: 15,
    marginRight: 10,
    width: '40%', 
    justifyContent: 'space-between', 
  },
  infoCard: {
    ...Spacing.flexColumn,
    ...UI.card(),
    width: '90%',
    justifyContent: 'space-around',
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
    height: '80%',
    ...UI.bottomModal,
  },
  modalBody: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    flexWrap: 'wrap',
  },
})

export default PetDetailsScreen