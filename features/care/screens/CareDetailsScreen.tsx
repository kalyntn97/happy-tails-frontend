//npm
import React, { FC } from "react"
import { Image, Text, View } from "react-native"
//types & helpers & queries
import { Care, Tracker } from "@care/CareInterface"
import { CARES, getCareIcon, getCurrentTrackerIndex } from "@care/careHelpers"
import { useGetCareById } from "@care/careQueries"
import { useDeleteCareCard } from "@hooks/sharedHooks"
//components
import { ActionButton, StatButton } from "@components/ButtonComponents"
import BarChart from "@components/Charts/BarChart"
import DailyChart from "@components/Charts/DailyChart"
import FillChart from "@components/Charts/FillChart"
import YearChart from "@components/Charts/YearChart"
import Loader from "@components/Loader"
import PetList from "@components/PetInfo/PetList"
import { BoxWithHeader, ErrorImage, ScrollContainer, TitleLabel } from "@components/UIComponents"
import { getActionIconSource } from "@utils/ui"
//styles
import { Colors, Spacing, UI } from '@styles/index'
import { styles } from "@styles/stylesheets/DetailsScreenStyles"

interface CareDetailsProps {
  navigation: any
  route: { params: { care: Care }}
}

const CareDetailsScreen: FC<CareDetailsProps> = ({ navigation, route }) => {
  const { care: initialCare } = route.params
  const { data: care, isSuccess, isFetching, isError } = useGetCareById(initialCare._id, initialCare)
  const { showDeleteConfirmDialog, handleDeleteCareCard } = useDeleteCareCard(navigation)
  
  const trackers = [...care.trackers].reverse()
  const taskIndex = getCurrentTrackerIndex(care.frequency)

  const careStats = [
    { header: 'streak', stat: 0, body: 'days' },
    { header: 'current', stat: trackers[0].done[taskIndex].value, body: `of ${care.times}`},
    { header: 'longest', stat: 0, body: 'days' },
  ]

  const actions = [
    { key: 'edit', icon: 'editSquare', onPress: () => navigation.navigate('CareEdit', { care }) },
    { key: 'delete', icon: 'deleteSquare', onPress: () => showDeleteConfirmDialog(care, handleDeleteCareCard) },
  ]

  return (
    <View style={{ ...Spacing.scrollScreenDown, backgroundColor: Colors.multi.lightest[care.color] }}>
      <View style={styles.topBtnCon}>
        { actions.map(action => <ActionButton key={action.key} icon={action.key} onPress={action.onPress} size='small' />) }
      </View>

      { isError && <ErrorImage /> }                                                              
      { isFetching && <Loader /> }

    { isSuccess &&
        <ScrollContainer>
          <View style={styles.headerContainer}>
            <Image source={getCareIcon(care.name)} style={{ ...UI.largeIcon }} />
            <Text style={styles.header}>{CARES[care.name] ?? care.name}</Text>
            <View style={[styles.itemInfo]}>
              <View style={styles.rowCon}>
                <Image source={getActionIconSource('due')} style={styles.itemIcon}/>
                <Text style={styles.subHeader}>
                  {new Date(care.date).toLocaleDateString()}
                  {care.endDate &&
                    <Text> - {new Date(care.endDate).toLocaleDateString()}</Text>
                  }
                </Text>
              </View>
              <View style={styles.rowCon}>
                <Image source={getActionIconSource('freq')} style={styles.itemIcon} />
                <Text style={styles.subHeader}>
                  {care.times} times / {
                    care.frequency === 'Daily' ? 'day' 
                    : care.frequency === 'Weekly' ? 'week' 
                    : care.frequency === 'Monthly' ? 'month' 
                    : 'year'
                  }
                </Text>
              </View>
    
            </View>
          
            <PetList petArray={care.pets} size='small' />

            <View style={styles.btnContainer}>
              { careStats.map(stat =>
                <StatButton key={stat.header} header={stat.header} body={stat.body} stat={stat.stat} bgColor={Colors.multi.light[care.color]} size='medium' disabled={true} />
              )}
            </View>
          </View>

          <BoxWithHeader title='History' iconName="chart">
            { trackers.map((tracker: Tracker, idx: number) =>
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
            )}
          </BoxWithHeader>
            
          

          <View style={{ ...UI.card()}}>
            {actions.map(action => 
              <TitleLabel key={action.key} title={action.key} iconName={action.icon} onPress={action.onPress} color={action.key === 'delete' && Colors.red.dark} />
            )}
          </View>
        </ScrollContainer> 
      } 
    </View>
  )
}

export default CareDetailsScreen                                           