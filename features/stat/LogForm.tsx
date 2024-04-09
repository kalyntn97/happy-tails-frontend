//npm
import { FC, useState } from "react"
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native"
//helpers
import { getActionIconSource, statQualIconSource } from "@utils/ui"
//styles
import { Forms, Spacing } from "@styles/index"

interface LogFormProps {
  name: string
  initialValues?: { name: string, value: number, date: Date }
  onSelect: (item: { name: string, value: number }) => void
}

const LogForm: FC<LogFormProps> = ({ name, initialValues, onSelect }) => {
  const [value, setValue] = useState<number>(initialValues?.value ?? null)

  const options = statQualIconSource[name]
  
  let optionCon = []

  for (let i = options.length - 1; i >=0; i--) {
    optionCon.push(
      <TouchableOpacity key={i} onPress={() => {
        value === i ? setValue(null) : setValue(i)
        onSelect({ name: name, value: i })
      }}>
        {value === i &&
          <Image source={getActionIconSource('check')} style={styles.selected} /> 
        }
        <Image source={options[i]} style={{ ...Forms.xLargeIcon, margin: 10 }} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {initialValues?.date && 
        <Text>{new Date(initialValues.date).toLocaleString()}</Text>
      }
      <View style={styles.optionCon}>{ optionCon }</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  optionCon: {
    width: '100%',
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selected: {
    ...Forms.smallIcon,
    position: 'absolute',
    zIndex: 1,
    top: 5,
    right: 0,
  },
})

export default LogForm