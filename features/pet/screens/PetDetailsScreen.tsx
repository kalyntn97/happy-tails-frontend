import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
//types & context & hooks
import { showDeleteConfirmDialog } from "@hooks/sharedHooks"
import { Pet } from "@pet/PetInterface"
import { PET_DETAILS } from "@pet/petHelpers"
import { STATS } from "@stat/statHelpers"
//components
import { ActionButton, TransparentButton } from "@components/ButtonComponents"
import Loader from "@components/Loader"
import PetInfo from "@components/PetInfo/PetInfo"
import { BottomModal, ErrorImage, FormHeader, Icon, ScrollScreen, TitleLabel } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
import StatButtonList from "@pet/components/StatButtonList"
import { IconType } from "@utils/ui"
//store & queries
import { petKeyFactory, useDeletePet, useGetPetById } from "@pet/petQueries"
import { useGetPetSettings, useSetActions } from "@store/store"
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'

interface PetDetailsProps {
  navigation: any
  route: { params: { petId: string } }
}

type SectionType = 'info' | 'logs' | 'actions'

const Item = ({ label, type, logs, info, onPress }: { label: string, type: SectionType, logs: string[], info: string[], onPress: () => void }) => {
  const item = useMemo(() => {
    switch (type) {
      case 'info': return { isActive: info.includes(label), iconType: 'pet', name: PET_DETAILS[label] }
      case 'logs': return { isActive: logs.includes(label), iconType: 'stat', name: STATS[label].name }
      default: return null
    }
  }, [label, info, logs])

  return (
    <Pressable style={[styles.itemCon, item.isActive ? UI.active : UI.inactive]} onPress={onPress}>
      <Icon type={item.iconType as IconType} name={label} size={'large'} />
      <Text style={[Typography.smallHeader, {  margin: 0 }]}>{item.name}</Text>
    </Pressable>
  ) 
}

const defaultInfo = ['ids', 'services']
const defaultLogs = ['mood', 'weight', 'energy']

const PetDetailsScreen = ({ navigation, route }: PetDetailsProps) => {
  const queryClient = useQueryClient()
  const { petId } = route.params
  const petCache: Pet | undefined = queryClient.getQueryData(petKeyFactory.petById(petId))
  const {data: pet, isSuccess, isFetching, isError} = useGetPetById(petId, !petCache)

  const infoSetting = useGetPetSettings(petId, 'info')
  const logsSetting = useGetPetSettings(petId, 'logs')
  const { setPetSettings } = useSetActions()

  const [modalVisible, setModalVisible] = useState(false)
  const [option, setOption] = useState<SectionType>(null)
  const [info, setInfo] = useState<string[]>(infoSetting ?? defaultInfo)
  const [logs, setLogs] = useState<string[]>(logsSetting ?? defaultLogs)

  const deletePetMutation = useDeletePet(navigation)

  const handleDeletePet = (petId: string) => deletePetMutation.mutate(petId)
  
  //filter list
  const items = option === 'logs' ? Object.keys(STATS) : Object.keys(PET_DETAILS)
  const filteredItems = option === 'logs' ? logs : info
  
  const resetItems = (type: SectionType) =>{
    switch (type) {
      case 'info': return setInfo(defaultInfo)
      case 'logs': return setLogs(defaultLogs)
      default: return
    }
  }

  const toggleItem = (type: string) => {
    switch (option) {
      case 'logs': return setLogs(prev => logs.includes(type) ? prev.filter(p => p !== type) : [...prev, type])
      case 'info': return setInfo(prev => info.includes(type) ? prev.filter(p => p !== type) : [...prev, type])
      default: return 
    }
  }

  const headerActions = useMemo(() => ([
    { icon: 'search', onPress: null },
    { icon: 'edit', onPress: () => navigation.navigate('PetEdit', { pet: pet }) },
    { icon: 'add', onPress:() => navigation.navigate('CreateLog', { pet: { _id: pet._id, name: pet.name } }) },
  ]), [navigation, pet])

  const filteredList = useMemo(() => ({
    info: { titles: info, iconType: 'pet', getName: (info: string) => PET_DETAILS[info], onNavigate: (info: string) => navigation.navigate('PetMoreDetails', { petId, show: info }) },
    logs: { titles: logs, iconType: 'stat', getName: (log: string) => log, onNavigate: (log: string) => navigation.navigate('LogDetails', { stat: log }) },
  }), [info, logs, petId])

  const actions = useMemo(() => ([
    { key: 'log', title: 'Log pet stats', icon: 'add', onPress: () => navigation.navigate('CreateLog', { pet: { _id: pet._id, name: pet.name } }) },
    { key: 'edit', title: 'Update pet info', icon: 'edit', onPress: () => navigation.navigate('PetEdit', { pet: pet }) },
    { key: 'delete', title: deletePetMutation.isPending ? 'Deleting...' : 'Delete pet profile', icon: 'delete', onPress: () => showDeleteConfirmDialog(pet, handleDeletePet) },
  ]), [pet, navigation, handleDeletePet, deletePetMutation])

  const renderActions = ( 
    actions.map((action, index) =>{
      const focusedStyles = action.key === 'delete' && Typography.error
      return <TitleLabel key={action.key} title={action.title} iconName={action.icon} onPress={action.onPress} titleStyles={focusedStyles} containerStyles={index < actions.length - 1 && UI.tableRow()} size="small" />
    })
  )

  const renderFilteredList = (type: 'info' | 'logs') => (
    filteredList[type].titles.length > 0 ? filteredList[type].titles.map((label, index) => 
    <TitleLabel key={label} title={filteredList[type].getName(label)} iconType={filteredList[type].iconType as IconType} iconName={label} onPress={() => filteredList[type].onNavigate(label)} size='small' containerStyles={index < filteredList[type].titles.length - 1 && UI.tableRow()} />
    ) 
    : <>
      <TransparentButton title='Reset options' onPress={() => resetItems(type)} color={UI.lightPalette().accent} />
      <FormHeader title="No option selected" size='xSmall' />
    </>
  )

  const sections = [
    { key: 'info', title: 'Important', iconName: 'info', renderList: renderFilteredList('info') },
    { key: 'logs', title: 'Logs', iconName: 'chart', renderList: renderFilteredList('logs') },
    { key: 'actions', title: 'Actions', iconName: 'action', rightAction: false, renderList: renderActions },
  ]
  
  useEffect(() => { 
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' bgColor={Colors.multi.lightest[pet?.color]} />
    })
    if (!modalVisible) {
      const timeout = setTimeout(() => {
        setPetSettings(petId, option, option === 'info' ? info : logs)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [modalVisible, info, logs, pet, headerActions, navigation])

  return (    
    <ScrollScreen bgColor={Colors.multi.lightest[pet.color]}>  
      { isFetching && <Loader /> }
      { isError && <ErrorImage /> }
      
      { isSuccess && <>
        <View style={styles.infoCard}>
          <PetInfo pet={pet} size='large' />
          <StatButtonList petId={pet._id} petColor={pet.color} size='small' navigation={navigation} />
        </View>

        { sections.map(section =>
          <View key={section.key} style={Spacing.flexColumnStretch}>
            <TitleLabel size='small' title={section.title} iconName={section.iconName} mode='bold' rightAction={section.rightAction !== false &&
              <ActionButton icon="filter" onPress={() => {
                setModalVisible(true)
                setOption(section.key as SectionType)
              }} /> 
            } containerStyles={{ marginTop: 15, marginBottom: 0 }}/>
            <View style={[UI.card(true, false, undefined, undefined, 0), Spacing.flexColumnStretch]}>
              { section.renderList }
            </View>
          </View>
        )}
      </> }

      <BottomModal modalVisible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={Spacing.flexRow}>
          <FormHeader title={option === 'info' ? 'Show Pet Details' : 'Show Pet Logs'} />
          <Icon name="filter" />
        </View>
        <View style={styles.modalBody}>
          { items.map((item: string, index: number) => <Item key={`${item}-${index}`} label={item} type={option} logs={logs} info={info} onPress={() => toggleItem(item)} />) }
        </View>
      </BottomModal>
    </ScrollScreen>
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
    ...UI.card(true),
    justifyContent: 'space-around',
    borderRadius: 20,
    backgroundColor: Colors.white,
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