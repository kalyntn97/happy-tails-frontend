import { ImageSourcePropType } from "react-native"
import { Colors } from "@styles/index"
import { Care } from "@care/CareInterface"
import { getCurrentDate, getMonth } from "@utils/datetime"

export const careData = ['Teeth Brushing', 'Nail Clipping', 'Walk', 'Grooming', 'Litter Box Cleaning', 'Others']

export const getIconSource  = (name: string): ImageSourcePropType => {
  switch (name) {
    default: 
      return require('@assets/icons/paw.png')
    case 'Teeth Brushing':
      return require('@assets/icons/toothbrush.png')
    case 'Nail Clipping':
      return require('@assets/icons/clippers.png')
    case 'Walk':
      return require('@assets/icons/leash-walk.png')
    case 'Grooming':
      return require('@assets/icons/grooming.png')
    case 'Litter Box Cleaning':
      return require('@assets/icons/litter-box.png')
    //buttons
    case 'Add a Task': 
      return require('@assets/icons/care-filled.png')
    case 'Add a Vet Visit': 
      return require('@assets/icons/vet-filled.png')
    case 'Add a Pet': 
      return require('@assets/icons/pet-filled.png')
  }
}

export const frequencyData = ['Daily', 'Weekly', 'Monthly', 'Yearly']

export const getCurrentTrackerIndex = (frequency: string): number => {
  const { date, week, month } = getCurrentDate()
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

export const getTaskStatus = (task: Care) => {
  const { date: currDate, week: currWeek, month: monthIdx } = getCurrentDate()
  switch (task.frequency) {
    case 'Daily': 
      return task.trackers[task.trackers.length - 1].done[currDate - 1]
    case 'Weekly': 
      return task.trackers[task.trackers.length - 1].done[currWeek - 1]
    case 'Monthly':
      return task.trackers[task.trackers.length - 1].done[monthIdx - 1]
    case 'Yearly':
      return task.trackers[task.trackers.length - 1].done
  }
}

export const getTaskBackgroundColor = (frequency: string) => {
  switch (frequency) {
    case 'Daily': return Colors.multiArray[0]
    case 'Weekly': return Colors.multiArray[1]
    case 'Monthly': return Colors.multiArray[2]
    default: return Colors.multiArray[3]
  }
}

export const sortByFrequency: (careArray: Care[]) => {[key: string]: Care[]} = (careArray: Care[]) => {
  const sorted = careArray.reduce((result, careCard) => {
    const { frequency } = careCard
    result[frequency] = result[frequency] || []
    result[frequency].push(careCard)
    return result
  }, {})
  return sorted
}