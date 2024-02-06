import { ImageSourcePropType } from "react-native"
import { usePetContext } from "../context/PetContext"
import { Colors } from "../styles"

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

export const getMonth = (monthIdx: number) => {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ]
  return months[monthIdx - 1] // 0-index
}

export const getColorArray = (): string[] => {
  const colorArrays = [
    Colors.greenArray, Colors.blueArray, Colors.pinkArray, Colors.yellowArray, Colors.purpleArray
  ]
  const randomIdx = Math.floor(Math.random() * colorArrays.length)
  return colorArrays[randomIdx]
}

export const getColor = (ref: number, value: number, colorArray: string[]): string => {
  const color = ref === value 
    ? colorArray[0] 
    : value === 0 
      ? colorArray[2] 
      : colorArray[1]
  return color
}

export const getDayOfWeek = (date: Date) => {
  const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return daysOfWeek[date.getDay()]
}

export const getCurrentDate = () => {
  const today = new Date()
  const date = today.getDate()
  const month =today.getMonth() + 1 //0-index 
  const year = today.getFullYear()
  const day = getDayOfWeek(today)
  const monthName = getMonth(month)

  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)

  const daysInMonth = lastDayOfMonth.getDate()
  const weeksInMonth = Math.ceil((daysInMonth + firstDayOfMonth.getDay()) / 7)

  const daysPassed = date - 1  
  const weeksPassed = Math.floor((daysPassed + firstDayOfMonth.getDay()) / 7)
  const week = weeksPassed + 1
  
  
  return { date, month, monthName, year, day, week, daysInMonth, weeksInMonth, daysPassed, weeksPassed }
}

export const frequencyData = ['Daily', 'Weekly', 'Monthly', 'Yearly']

export const careData = ['Teeth Brushing', 'Nail Clipping', 'Walk', 'Grooming', 'Litter Box Cleaning', 'Others']

export const getCurrentTrackerIndex = (frequency: string): number => {
  const { date, week, month } = getCurrentDate()
  console.log(date, week ,month)
  switch (frequency) {
    case 'Daily':
      return date - 1 //current date, all 0-index
    case 'Weekly':
      return week - 1 //current week
    case 'Monthly' :
      return month - 1 //current month
    default:
      return 0
  }
}

export const getDateTimeFromTracker = (trackerName: string) => {
  let trackerMonth: number, trackerMonthName: string, trackerYear: number, isCurrent: boolean
  const { month: currMonth, year: currYear } = getCurrentDate()
  // tracker name: 'mm-yyyy'
  if (trackerName.includes('-')) { // tracker is monthly-based, new tracker every month
    const splitName = trackerName.split('-') // output 'mm' & 'yyyy'
    trackerMonth = Number(splitName[0])
    trackerMonthName = getMonth(trackerMonth) // get full month name
    trackerYear = Number(splitName[1])
    isCurrent = currMonth === trackerMonth && currYear === trackerYear
  } else { // tracker is yearly-based, new tracker every year
    trackerYear = Number(trackerName)
    isCurrent = trackerYear === currYear
  }
  return { trackerMonth, trackerMonthName, trackerYear, isCurrent }
}