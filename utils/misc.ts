import Toast from "react-native-toast-message"
import { FREQUENCY_TYPES } from "./constants"
import { daysOfWeek, getDateConstructor, getDateInfo } from "./datetime"
import { AlertForm } from "./ui"

export const keyFromName = (data: {[key: string]: string}) => {
  const map = {}
  for (const key in data) {
    const name = data[key]
    map[name] = key
  }
  return map
} 

export const numArray = (length: number) => {
  return Array.from({ length: length }, (_, index) => index + 1)
}

export const isObjectInArray = (obj: any, array: any[]) => array.some(item => JSON.stringify(item) === JSON.stringify(obj))

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

export const showRequireSelectionToast = () => showToast({ text1: 'At least 1 selection is required.', style: 'info' })

export const sortByFrequency = (array: any[]) => {
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

export const isItemVisible = (item: any, activeDate: Date): boolean => {
  const startDate = getDateConstructor(item.startDate)

  if (!item.repeat) return startDate.toLocaleDateString() === activeDate.toLocaleDateString()

  const endDate = item.endDate ? getDateConstructor(item.endDate) : null
  if (activeDate < startDate || (endDate && activeDate > endDate)) return false
  
  const { day, date, monthName } = getDateInfo(activeDate.toISOString())
  
  switch (item.frequency.type) {
    case 'days': { 
      const daysBetween = Math.floor((activeDate.getTime() - startDate.getTime()) / (3600 * 24 * 1000))
      return daysBetween % item.frequency.interval === 0
    }
    case 'weeks': {
      const isCorrectDay = item.frequency.timesPerInterval.some((i: number) => daysOfWeek[i] === day)
      const weeksBetween = Math.floor((activeDate.getTime() - startDate.getTime()) / (3600 * 24 * 1000 * 7))
      return isCorrectDay && weeksBetween % item.frequency.interval === 0
    }
    case 'months': {
      const isCorrectDay = item.frequency.timesPerInterval.includes(date)
      const yearsBetween = activeDate.getFullYear() - startDate.getFullYear()
      const monthsBetween = activeDate.getMonth() - startDate.getMonth() + yearsBetween * 12
      return isCorrectDay && monthsBetween % item.frequency.interval === 0
    }
    case 'years': {
      const isCorrectMonthDay = item.frequency.timesPerInterval.some((obj: { month: string, day: number }) => obj.month === monthName.slice(0, 3) && obj.day === date)
      const yearsBetween = activeDate.getFullYear() - startDate.getFullYear()
      return isCorrectMonthDay && yearsBetween % item.frequency.interval === 0
    }
    default: return false
  }
}