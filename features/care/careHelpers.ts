import { ImageSourcePropType } from "react-native"
import { Colors } from "@styles/index"
import { Care, Tracker } from "@care/CareInterface"
import { getMonth, getDateInfo } from "@utils/datetime"
import { keyFromName } from "@utils/misc"

export const CARES = {
  nail: 'Clip nail', 
  teeth: 'Brush teeth', 
  walk: 'Walk', 
  brush: 'Brush', 
  litter: 'Clean litter box', 
  groom: 'Groom service', 
  bath: 'Give bath',
  med: 'Give medication',
  train: 'Train commands',
  feed: 'Feed',
  refillMed: 'Refill medication',
  others: 'Others',
}

export const CARE_NAMES = Object.keys(CARES).map(key => CARES[key])

export const careKeyFromName = keyFromName(CARES)

export const CARE_FREQ = ['Daily', 'Weekly', 'Monthly', 'Yearly']

export const getCurrentTrackerIndex = (frequency: string): number => {
  const { date, week, month } = getDateInfo('today')
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

export const getTaskIndex = (frequency: string, activeDate: number | null, activeWeek: number | null, activeMonth: number | null): number => {
  const latestIndex = getCurrentTrackerIndex(frequency)
  const mapByFrequency = {
    Daily: activeDate,
    Weekly: activeWeek,
    Monthly: activeMonth,
    Yearly: 0,
  }
  return mapByFrequency[frequency] ?? latestIndex
}

export const getTaskStatus = (task: Care, trackerIndex: number, taskIndex: number) => {
  switch (task.frequency) {
    case 'Daily': 
      return task.trackers[trackerIndex].done[taskIndex].value
    case 'Weekly': 
      return task.trackers[trackerIndex].done[taskIndex].value
    case 'Monthly':
      return task.trackers[trackerIndex].done[taskIndex].value
    case 'Yearly':
      return task.trackers[trackerIndex].done[0].value
  }
}

export const getTrackerDisplayName = (frequency: string, activeDate: number | null, activeWeek: number | null, activeMonthName: string | null, activeYear: number | null): string => {
  const { date, week, monthName, year } = getDateInfo('today')
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
  const { month: currMonth, year: currYear } = getDateInfo('today')
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
    case 'Daily': return Colors.multi.light[0]
    case 'Weekly': return Colors.multi.light[1]
    case 'Monthly': return Colors.multi.light[2]
    default: return Colors.multi.light[3]
  }
}

export const sortByFrequency: (careArray: Care[]) => {[key: string]: Care[]} = (careArray: Care[]) => {
  const sorted = careArray.reduce((result, care) => {
    const { frequency } = care
    result[frequency] = result[frequency] || []
    result[frequency].push(care)
    return result
  }, {})
  return sorted
}

