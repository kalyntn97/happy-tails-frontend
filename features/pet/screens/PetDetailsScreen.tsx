import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
//types & context & hooks
import { Pet } from "@pet/PetInterface"
import { PET_DETAILS } from "@pet/petHelpers"
import { STATS } from "@stat/statHelpers"
//components
import { ActionButton, TransparentButton } from "@components/ButtonComponents"
import Loader from "@components/Loader"
import PetInfo from "@components/PetInfo/PetInfo"
import { BottomModal, ErrorImage, FormHeader, Icon, ItemActions, ScrollScreen, TitleLabel } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
import { IconType } from "@utils/ui"
//store & queries
import { petKeyFactory, useDeletePet, useGetPetById } from "@pet/petQueries"
import { useGetPetSettings, useSetActions } from "@store/store"
//styles
import { StackScreenNavigationProp } from "@navigation/types"
import { Colors, Spacing, Typography, UI } from '@styles/index'

interface PetDetailsProps {
  navigation: StackScreenNavigationProp
  route: { params: { petId: string } }
}

type SectionType = 'info' | 'logs' | 'actions'

const filterHelper = (arr: string[], value: string) => arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]

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

const defaultInfo = ['id', 'service']
const defaultLogs = ['mood', 'weight', 'energy']

const headerActions = (navigation: any, pet: Pet) => ([
  { icon: 'search', onPress: () => navigation.goBack(), size: 'xSmall' },
  { icon: 'edit', onPress: () => navigation.navigate('PetEdit', { pet: pet }), size: 'xSmall' },
  { icon: 'add', onPress:() => navigation.navigate('CreateStat', { pet: { _id: pet._id, name: pet.name } }), size: 'xSmall' },
])

const PetDetailsScreen = ({ navigation, route }: PetDetailsProps) => {
  const queryClient = useQueryClient()
  const { petId } = route.params
  const petCache: Pet | undefined = queryClient.getQueryData(petKeyFactory.petById(petId))

  const {data: pet, isSuccess, isFetching, isError} = useGetPetById(petId, !petCache)
  const { handleDeletePet, isPending } = useDeletePet(navigation)
  
  const infoSetting = useGetPetSettings(petId, 'info')
  const logsSetting = useGetPetSettings(petId, 'logs')
  const { setPetSettings } = useSetActions()

  const [modalVisible, setModalVisible] = useState(false)
  const [option, setOption] = useState<SectionType>(null)
  const [info, setInfo] = useState<string[]>(infoSetting ?? defaultInfo)
  const [logs, setLogs] = useState<string[]>(logsSetting ?? defaultLogs)
  
  //filter list
  const items = option === 'logs' ? Object.keys(STATS) : Object.keys(PET_DETAILS)
  
  const resetItems = (type: SectionType) =>{
    if (type === 'info') {
      setInfo(defaultInfo)
    } else if (type === 'logs') {
      setLogs(defaultLogs)
    }
    setPetSettings(petId, type, type === 'info' ? defaultInfo : defaultLogs)
  }

  const toggleItem = (type: string) => {
    if (option === 'logs') {
      return setLogs(prev => filterHelper(prev, type))
    } else if (option === 'info') {
      return setInfo(prev => filterHelper(prev, type))
    }
  }

  const filteredList = useMemo(() => ({
    info: {
      titles: info, iconType: 'pet', 
      getName: (info: string) => PET_DETAILS[info], 
      onNavigate: (info: string) => navigation.navigate('PetMoreDetails', { petId, show: info }) 
    },
    logs: { 
      titles: logs, iconType: 'stat', 
      getName: (log: string) => log, 
      onNavigate: (log: string) => navigation.navigate('StatDetails', { stat: log }) 
    },
  }), [info, logs, petId])

  const bottomActions = useMemo(() => ([
    { key: 'log', title: 'Log pet stats', icon: 'add', onPress: () => navigation.navigate('CreateStat', { pet: { _id: pet._id, name: pet.name } }) },
    { key: 'edit', title: 'Update pet info', icon: 'edit', onPress: () => navigation.navigate('PetEdit', { pet: pet }) },
    { key: 'delete', title: isPending ? 'Deleting...' : 'Delete pet profile', icon: 'delete', onPress: () => handleDeletePet(pet) },
  ]), [pet, navigation, handleDeletePet, isPending])

  const renderFilteredList = (type: 'info' | 'logs') => (
    filteredList[type].titles.length > 0 ? filteredList[type].titles.map((label, index) => 
    <TitleLabel key={label} title={filteredList[type].getName(label)} iconType={filteredList[type].iconType as IconType} iconName={label} onPress={() => filteredList[type].onNavigate(label)} size='small' containerStyles={{ ...(index < filteredList[type].titles.length - 1 && UI.tableRow()), ...UI.rowContent(undefined, 0)}} />
    ) 
    : <>
      <TransparentButton title='Reset options' onPress={() => resetItems(type)} color={UI.lightPalette().accent} />
      <FormHeader title="No option selected" size='xSmall' />
    </>
  )

  const sections = [
    { key: 'info', title: 'Important', iconName: 'info', renderList: renderFilteredList('info') },
    { key: 'logs', title: 'Logs', iconName: 'chart', renderList: renderFilteredList('logs') },
    { key: 'actions', title: 'Actions', iconName: 'action', rightAction: false, renderList: <ItemActions actions={bottomActions} /> },
  ]
  
  useEffect(() => { 
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions(navigation, pet)} navigation={navigation} mode='modal' bgColor={Colors.multi.lightest[pet?.color]} />
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
          {/* <StatButtonList petId={pet._id} petColor={pet.color} size='small' navigation={navigation} /> */}
        </View>

        { sections.map(section => 
          <View key={section.key} style={Spacing.flexColumnStretch}>
            <TitleLabel size='small' title={section.title} iconName={section.iconName} mode='bold' 
              containerStyles={{ marginTop: 15, marginBottom: 0 }}
              rightAction={ section.rightAction !== false &&
                <View style={Spacing.flexRow}>
                  <ActionButton icon='reset' buttonStyles={{ marginRight: 30 }} onPress={() => resetItems(section.key as SectionType)} />

                  <ActionButton icon="filter" onPress={() => {
                    setModalVisible(true)
                    setOption(section.key as SectionType)
                  }} /> 
                </View>
              } 
            />

            <View style={styles.sectionCon}>
              { section.renderList }
            </View>
          </View>
        )}
      </> }
      
      <BottomModal height='100%' modalVisible={modalVisible} onDismiss={() => setModalVisible(false)}>
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
  infoCard: {
    ...Spacing.flexColumnStretch,
    ...UI.card(true, false, 20, undefined, 20, 30),
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
  },
  sectionCon: {
    ...UI.card(true, false, undefined, 0), 
    ...Spacing.flexColumnStretch,
  },
  itemCon: {
    ...Spacing.flexColumn,
    margin: 20,
  },
  modalBody: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    flexWrap: 'wrap',
  },
})

export default PetDetailsScreen