import Toast from "react-native-toast-message"
import { AlertForm } from "./ui"
import { FREQUENCY_TYPES } from "./constants"

export const keyFromName = (data: {[key: string]: string}) => {
  const map = {}
  for (const key in data) {
    const name = data[key]
    map[name] = key
  }
  return map
} 

export const alertError = (error: Error) => {
  return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
}

export const alertSuccess = (action: string, navigation?: any) => {
  AlertForm({ body: `${action} successfully`, button: 'OK' })
  if (navigation) return navigation.goBack()
}

export const closeToast = () => {
  Toast.hide()
}

export const showToast = ({ text1, style, text2, duration }: { text1: string, style: string, text2?: string, duration?: number }) => {
  Toast.show({ type: 'catToast', text1: text1, text2: text2, visibilityTime: duration ?? 3000, props: { style: style, onClose: closeToast }, position: 'bottom', bottomOffset: 50 })
}

export const sortByFrequency = (array) => {
  const sorted = [...FREQUENCY_TYPES, 'oneTime'].reduce((result, frequency) => {
    result[frequency] = []
    return result
  }, {})
  array.forEach(item => {
    const { frequency } = item
    const key = frequency.type || 'oneTime'
    sorted[key].push(item)
  })
  return sorted
}
