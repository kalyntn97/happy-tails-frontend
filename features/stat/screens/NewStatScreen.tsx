//npm
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
//helpers & types
import { AlertForm, getStatIconSource, statIconSource } from '@utils/ui'
import { STATS } from '../statHelpers'
import { Pet } from '@pet/PetInterface'
//components
import { CheckboxButton, MainButton, TransparentButton } from '../../../components/ButtonComponent'
import IconStatForm from '../components/IconStatForm'
//styles
import { Colors, UI, Spacing, Typography } from '@styles/index'
import RatingForm from '../components/RatingForm'
import InputForm from '../components/InputForm'
import { useAddStats } from '../statQueries'
import { LogData, StatFormData } from '../statInterface'
import { ErrorMessage } from '@components/UIComponents'

interface NewStatScreenProps {
  route:{ params: { pet: {_id: string, name: string } } }
  navigation: any
}

const NewStatScreen: FC<NewStatScreenProps> = ({ navigation, route }) => {
  const [names, setNames] = useState<string[]>([])
  const [index, setIndex] = useState<number>(0)
  const [logs, setLogs] = useState<LogData[]>([])
  const [errorMsg, setErrorMsg] = useState<string>(null)

  const { pet } = route.params
  const addStatsMutation = useAddStats(navigation)
  
  const addLog = (item: LogData) => {
    logs.find(prevItem => prevItem.name === item.name) 
      ? setLogs(prev => prev.filter(i => i.name !== item.name))
      : setLogs(prev => [...prev, item])
  }

  const handleSubmit = (petId: string, logs: LogData[]) => {
    if (logs.length !== names.length) {
      setErrorMsg('Please enter all selected values.')
    } else {
      setErrorMsg(null)
      addStatsMutation.mutate({ petId, logs })
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled' alwaysBounceVertical={false}>
      <Text style={{ ...Typography.mediumHeader }}>{pet.name.split(' ')[0]}'s Today Log</Text>
      <View style={styles.typeCon}>
        {Object.keys(STATS).map((stat, index )=>
          <View key={index} style={styles.typeItem}>
            <CheckboxButton bgColor={names.includes(stat) ? Colors.green.reg : Colors.shadow.light} initial={names.includes(stat)} onPress={() => {
              names.includes(stat)
                ? setNames(prev => prev.filter(n => n !== stat))
                : setNames(prev => [...prev, stat])
            }} />
            <Image source={getStatIconSource(stat)} style={{ ...UI.icon }} />
            <Text style={styles.typeText}>{STATS[stat].name}</Text>
          </View>
        )}
      </View>
  
      {index > 0 && 
        names.map((name, i) =>
          <View key={name} style={[{ zIndex: i === index - 1 ? 1 : 0 }, styles.itemOverlay]}>
            { name === 'mood' 
              ? <IconStatForm name={name} onSelect={addLog} /> 
              : Object.keys(STATS).filter(key => STATS[key].type === 'qual').includes(name) && name !== 'mood' 
              ? <RatingForm name={name} onSelect={addLog} />
              : <InputForm name={name} onSelect={addLog} />
            }
          </View>
      )}

      <View style={styles.footerCon}>
        {errorMsg && <ErrorMessage error={errorMsg} />}
        <View style={Spacing.flexRow}>
          {index === 0 &&
            <TransparentButton title='Cancel' size='small' onPress={() => navigation.goBack()} />
          }
          {index > 1 && <Image source={getStatIconSource(names[index - 2])} style={{ ...UI.smallIcon }} /> }
          {index > 0 &&
            <TransparentButton title='Back' size='small' onPress={() => {setIndex(prev => prev - 1)}} />
          }
          {index < names.length &&
            <MainButton title='Next' size='small' onPress={() => {setIndex(prev => prev + 1)}} />
          }
          {index !== 0 && index === names.length &&
            <MainButton title='Submit' size='small' onPress={() => handleSubmit(pet._id, logs)} />
          }
        {index < names.length && <Image source={getStatIconSource(names[index])} style={{ ...UI.smallIcon }} /> }
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    flexGrow: 1,
    position: 'relative',
  },
  footerCon: {
    ...Spacing.flexColumn,
    height: '20%',
    marginTop: 'auto',
  },
  itemOverlay: {
    position: 'absolute', 
    backgroundColor: Colors.shadow.lightest, 
    width: '100%', 
    height: '80%',
    justifyContent: 'center',
  },
  typeCon: {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
  },
  typeItem: {
    ...Spacing.flexRow,
    width: '45%',
    marginVertical: 10
  },
  typeText: {
    ...Typography.smallBody,
    marginLeft: 10
  },
})

export default NewStatScreen