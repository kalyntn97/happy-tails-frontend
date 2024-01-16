import { ImageSourcePropType } from "react-native"
import { usePetContext } from "../context/PetContext"

export const getIconSource  = (name: string): ImageSourcePropType => {
  switch (name) {
    default: 
      return require('../assets/icons/paw.png')
    case 'Teeth Brushing':
      return require('../assets/icons/toothbrush.png')
    case 'Nail Clipping':
      return require('../assets/icons/clippers.png')
    case 'Walk':
      return require('../assets/icons/leash-walk.png')
    case 'Grooming':
      return require('../assets/icons/grooming.png')
    case 'Litter Box Cleaning':
      return require('../assets/icons/litter-box.png')

  }
}

export const getDaysOfWeek = (date: Date) => {
  const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return daysOfWeek[date.getDay()]
}

export const getCurrentDate = () => {
  const today = new Date()
  const date = today.getDate()
  const month =today.getMonth() + 1
  const year = today.getFullYear()
  const day = getDaysOfWeek(today)

  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)

  const daysInMonth = lastDayOfMonth.getDate()
  const weeksInMonth = Math.ceil((daysInMonth + firstDayOfMonth.getDay()) / 7)

  const daysPassed = daysInMonth - date
  const weeksPassed = Math.floor((daysInMonth - date) / 7)
  
  return { date, month, year, day, daysInMonth, weeksInMonth, daysPassed, weeksPassed }
}

export const frequencyData = ['Daily', 'Weekly', 'Monthly', 'Yearly']

export const careData = ['Teeth Brushing', 'Nail Clipping', 'Walk', 'Grooming', 'Litter Box Cleaning', 'Others']

export const getCurrentTrackerIndex = (frequency: string): number => {
  const { date, weeksInMonth, weeksPassed } = getCurrentDate()
  switch (frequency) {
    case 'Daily':
      return date //current date
    case 'Weekly':
      console.log('weeksPassed', weeksPassed, 'weeksInMonth', weeksInMonth)
      return weeksInMonth - weeksPassed - 1 //current week, 0-index based
    default:
      return 0
  }
}