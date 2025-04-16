//npm
import React, { FC, useEffect } from "react"
import { ActivityIndicator, Image, Text, View } from "react-native"
//types & helpers & queries
import { Care, Tracker } from "@care/CareInterface"
import { CARES, getCareIcon, getCurrentTrackerIndex } from "@care/careHelpers"
import { useGetCareById } from "@care/careQueries"
import { useDeleteCareCard } from "@hooks/sharedHooks"
import { getActionIconSource } from "@utils/ui"
//components
import { ActionButton, StatButton } from "@components/ButtonComponents"
import BarChart from "@components/Charts/BarChart"
import DailyChart from "@components/Charts/DailyChart"
import FillChart from "@components/Charts/FillChart"
import YearChart from "@components/Charts/YearChart"
import Loader from "@components/Loader"
import PetList from "@components/PetInfo/PetList"
import { BoxWithHeader, ErrorImage, FormLabel, Icon, ItemActions, VScrollContainer, ScrollScreen, TitleLabel } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
//styles
import { Colors, Spacing, UI } from '@styles/index'
import { styles } from "@styles/stylesheets/DetailsScreenStyles"
import { getRepeatLabels } from "@components/Pickers/FrequencyPicker"
import { PetBasic } from "@pet/PetInterface"
import { StackScreenNavigationProp } from "@navigation/types"

interface CareDetailsProps {
  navigation: StackScreenNavigationProp
  route: { params: { care: Care }}
}

const CareDetailsScreen = ({ navigation, route }: CareDetailsProps) => {
  const { care: initialCare } = route.params
  const { data: care, isSuccess, isFetching, isError } = useGetCareById(initialCare._id, initialCare)
  const { handleDeleteCare, isPending } = useDeleteCareCard(navigation)

  const iconSource = getCareIcon(care.name)
  const { repeatLabel } = getRepeatLabels(care.frequency)
  console.log(care)
  
  // const trackers = [...care.trackers].reverse()
  // const taskIndex = getCurrentTrackerIndex(care.frequency)

  // const careStats = [
  //   { header: 'streak', stat: 0, body: 'days' },
  //   { header: 'current', stat: trackers[0].done[taskIndex].value, body: `of ${care.times}`},
  //   { header: 'longest', stat: 0, body: 'days' },
  // ]

  const headerActions = [
    { key: 'search', icon: 'search', onPress: () => navigation.goBack(), size: 'xSmall' },
    { key: 'edit', icon: 'edit', onPress: () => navigation.navigate('CareEdit', { care: care }), size: 'xSmall' },
    { key: 'delete', icon: 'delete', onPress: () => handleDeleteCare(care) },
    // { icon: 'add', onPress:() => navigation.navigate('CreateStat', { pet: { _id: pet._id, name: pet.name } }), size: 'xSmall' },
  ]

  const bottomActions = [
    { key: 'log', title: 'Log pet stats', icon: 'add', onPress: () => null },
    { key: 'edit', title: 'Update task', icon: 'edit', onPress: () => navigation.navigate('CareEdit', { care: care }) },
    { key: 'delete', title: isPending ? `${<ActivityIndicator />} Deleting...` : 'Delete task', icon: 'delete', onPress: () => handleDeleteCare(care) },
  ]

  useEffect(() => { 
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='card' bgColor={Colors.multi.lightest[care?.color]} />
    })
  }, [care, headerActions, navigation])

  return (
    <ScrollScreen bgColor={Colors.multi.lightest[care.color]}>
      { isError && <ErrorImage /> }                                                              
      { isFetching && <Loader /> }

      { isSuccess &&
        <View>
          <View style={styles.headerCon}>
            <View style={styles.headerTopCon}>
              <Image source={iconSource} style={styles.headerIcon} />
              <Text numberOfLines={2} style={styles.header}>{CARES[care.name] ?? care.name}</Text>
            </View>

            <PetList petArray={care.pets as PetBasic[]} size='small' />

            <View style={styles.rowCon}>
              <Icon name='due' />
              <Text style={styles.subHeader}>
                {new Date(care.startDate).toLocaleDateString()}
                { care.endDate &&
                  <Text> - {new Date(care.endDate).toLocaleDateString()}</Text>
                }
              </Text>
            </View>

            <View style={styles.rowCon}>
              <Icon name="schedule" />
              <Text style={styles.subHeader}>{repeatLabel}</Text>
            </View>
    
            {/* <View style={styles.btnContainer}>
              { careStats.map(stat =>
                <StatButton key={stat.header} header={stat.header} body={stat.body} stat={stat.stat} bgColor={Colors.multi.light[care.color]} size='medium' disabled={true} />
              )}
            </View> */}
          </View>
          <FormLabel label="History" icon="chart" />
          <View style={styles.sectionCon}>
            
            { care.frequency.type === 'days' ?
              <DailyChart />
            : null
            }
            {/* { trackers.map((tracker: Tracker, idx: number) =>
              <React.Fragment key={`tracker-${idx}`}>
                {care.frequency === 'Daily' 
                ? <DailyChart key={`Daily-${idx}`} tracker={tracker} times={care.times} />
                : care.times === 1 && care.frequency !== 'Yearly'
                ? <FillChart key={`1X-${idx}`} tracker={tracker} frequency={care.frequency} times={care.times} />
                : ( care.frequency === 'Weekly' || care.frequency === 'Monthly' ) 
                  ? <BarChart key={`${care.frequency}-${idx}`} tracker={tracker} frequency={care.frequency} times={care.times} />
                  : <YearChart key={`Yearly-${idx}`} tracker={tracker} times={care.times} />
                }
              </React.Fragment>
            )} */}
          </View>
            
          

          <View style={UI.card()}>
            <ItemActions actions={bottomActions} />
          </View>
        </View> 
      } 
    </ScrollScreen>
  )
}

export default CareDetailsScreen                                           