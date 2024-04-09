//npm
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
//helpers & types
import { getActionIconSource, statIconSource } from '@utils/ui'
import { STATS, STAT_TYPES } from './statHelpers'
import { Pet } from '@pet/PetInterface'
//components
import { CheckboxButton, MainButton, TransparentButton } from '../../components/ButtonComponent'
import LogForm from './LogForm'
//styles
import { Colors, Forms, Spacing, Typography } from '@styles/index'

interface NewStatScreenProps {
  route:{ params: { pet: {_id: string, name: string } } }
  navigation: any
}

const NewStatScreen: FC<NewStatScreenProps> = ({ navigation, route }) => {
  const [names, setNames] = useState<string[]>([])
  const [index, setIndex] = useState<number>(0)
  const [logs, setLogs] = useState([])
  const { pet } = route.params
  
  const addLog = (item: { name: string, value: number }) => {
    logs.find(prevItem => prevItem.name === item.name) 
      ? setLogs(prev => prev.filter(i => i.name !== item.name))
      : setLogs(prev => [...prev, item])
    console.log(logs)
  }
  
  return (
    <View style={styles.container}>
      <Text style={{ ...Typography.subHeader }}>Log {pet.name.split(' ')[0]} values</Text>
      <View style={styles.typeCon}>
        {Object.keys(STATS).map((stat, index )=>
          <View key={index} style={styles.typeItem}>
            <CheckboxButton initial={names.includes(stat)} onPress={() => {
              names.includes(stat)
                ? setNames(prev => prev.filter(n => n !== stat))
                : setNames(prev => [...prev, stat])
            }} />
            <Image source={statIconSource[stat]} style={{ ...Forms.icon }} />
            <Text style={styles.typeText}>{STATS[stat].name}</Text>
          </View>
        )}
      </View>
  
      {index > 0 && 
        names.map((name, i) =>
          <View key={name} style={[{ zIndex: i === index - 1 ? 1 : 0 }, styles.itemOverlay]}>
            <LogForm name={name} onSelect={addLog} />
          </View>
      )}

      <View style={{ ...Spacing.flexRow, height: '20%', marginTop: 'auto' }}>
        {index > 0 &&
          <TransparentButton title='Back' size='small' onPress={() => {setIndex(prev => prev - 1)}} />
        }
        {index < names.length &&
          <MainButton title='Next' size='smallRound' onPress={() => {setIndex(prev => prev + 1)}} />
        }
        {index !== 0 && index === names.length &&
          <MainButton title='Submit' size='smallRound' />
        }
      </View>
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    position: 'relative',
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