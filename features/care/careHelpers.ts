import { ImageSourcePropType } from "react-native"
import { Colors } from "@styles/index"
import { Care, Tracker } from "@care/CareInterface"
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

export const getTrackerIndex = (trackers: Tracker[], frequency: string, activeMonth: number, activeYear: number): number => {
  const monthlyTrackerName = `${activeMonth + 1}-${activeYear}`
  let activeIndex: number
  if (frequency === 'Daily' || frequency === 'Weekly') {
    activeIndex = trackers.findIndex(tracker => tracker.name === monthlyTrackerName)
  } else {
    activeIndex = trackers.findIndex(tracker => tracker.name === activeYear.toString())
  }
  return activeIndex !== -1 ? activeIndex : (trackers.length - 1)
}

export const getTaskIndex = (frequency: string, activeDate: number | null, activeWeek: number | null, activeMonth: number | null, activeYear: number | null): number => {
  const latestIndex = getCurrentTrackerIndex(frequency)
  const mapByFrequency = {
    Daily: activeDate,
    Weekly: activeWeek,
    Monthly: activeMonth,
    Yearly: activeYear,
  }
  return mapByFrequency[frequency] ?? latestIndex
}

export const getTaskStatus = (task: Care, trackerIndex: number, taskIndex: number) => {
  switch (task.frequency) {
    case 'Daily': 
      return task.trackers[trackerIndex].done[taskIndex]
    case 'Weekly': 
      return task.trackers[trackerIndex].done[taskIndex]
    case 'Monthly':
      return task.trackers[trackerIndex].done[taskIndex]
    case 'Yearly':
      return task.trackers[trackerIndex].done[0]
  }
}

export const getTrackerDisplayName = (frequency: string, activeDate: number | null, activeWeek: number | null, activeMonthName: string | null, activeYear: number | null): string => {
  const { date, week, monthName, year } = getCurrentDate()
  const mapByFrequency = {
    Daily: activeDate + 1 === date ? 'Today' : `${activeMonthName} ${activeDate + 1}`,
    Weekly: activeWeek + 1 === week ? 'This week' : `Week ${activeWeek + 1}`,
    Monthly: activeMonthName === monthName ? 'This month' : activeMonthName,
    Yearly: activeYear === year ? activeYear : year
  }
  return mapByFrequency[frequency]
}

export const getTrackerInfo = (trackerName: string) => {
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