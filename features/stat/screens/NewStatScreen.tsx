//npm
import React, { FC, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
//helpers & types
import { STATS } from '@stat/statHelpers'
import { LogData } from '@stat/statInterface'
import { useGetPetSettings } from '@store/store'
import { useAddStats } from '@stat/statQueries'
//components
import IconStatForm from '@stat/components/IconStatForm'
import InputForm from '@stat/components/InputForm'
import RatingForm from '@stat/components/RatingForm'
import { CheckBoxButton, MainButton, TransparentButton } from '@components/ButtonComponents'
import { ErrorMessage, FormHeader, Icon, ScrollScreen } from '@components/UIComponents'
//styles
import { Colors, Spacing, Typography } from '@styles/index'

interface NewStatScreenProps {
  route:{ params: { pet: { _id: string, name: string } } }
  navigation: any
}

const NewStatScreen = ({ navigation, route }: NewStatScreenProps) => {
  const { pet } = route.params
  const logsSetting = useGetPetSettings(pet._id, 'logs')

  const [names, setNames] = useState<string[]>(logsSetting ?? [])
  const [index, setIndex] = useState<number>(0)
  const [logs, setLogs] = useState<LogData[]>([])
  const [errorMsg, setErrorMsg] = useState<string>(null)
  const addStatsMutation = useAddStats(navigation)
  
  const addLog = (item: LogData) => {
    logs.find(prevItem => prevItem.name === item.name) 
      ? setLogs(prev => prev.filter(i => i.name !== item.name))
      : setLogs(prev => [...prev, item])
  }

  const onSelect = (selected: string) => {
    names.includes(selected) 
    ? setNames(prev => prev.filter(n => n !== selected))
    : setNames(prev => [...prev, selected])
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
    <ScrollScreen>
      <FormHeader title={`${pet.name.split(' ')[0]}'s Today Log`} />
      <View style={styles.typeCon}>
        {Object.keys(STATS).map((stat, index )=>
          <View key={index} style={styles.typeItem}>
            <CheckBoxButton bgColor={names.includes(stat) ? Colors.green.reg : Colors.shadow.light} isChecked={names.includes(stat)} onPress={() => onSelect(stat)} />
            <Icon type='stat' name={stat} styles={{ marginHorizontal: 10 }} size='med' />
            <Text style={Typography.regBody}>{STATS[stat].name}</Text>
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
        { errorMsg && <ErrorMessage error={errorMsg} /> }

        <View style={Spacing.flexRowStretch}>
          { index > 1 && <Icon type='stat' name={names[index - 2]} /> }
          <TransparentButton title={index === 0 ? 'Cancel' : 'Back'} size='small'  h={10} 
            onPress={() => index === 0 ? navigation.goBack() : setIndex(prev => prev - 1)} 
          />
          
          { names.length > 0 && index < names.length && <>
            <MainButton title={index < names.length ? 'Next' : 'Submit'} size='small' h={10} 
              onPress={() => index < names.length ? setIndex(prev => prev + 1) : handleSubmit(pet._id, logs) } 
            /> 
            <Icon type='stat' name={names[index]} /> 
          </> }
        </View>
      </View>

    </ScrollScreen>
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
    marginTop: 30,
  },
  itemOverlay: {
    position: 'absolute', 
    backgroundColor: Colors.shadow.lightest, 
    width: '100%', 
    height: '80%',
    justifyContent: 'center',
  },
  typeCon: {
    ...Spacing.flexRowStretch,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  typeItem: {
    ...Spacing.flexRow,
    width: '45%',
    marginVertical: 15
  },
})

export default NewStatScreen