import { Time } from "@components/Pickers/TimePicker"

export const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

export const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const getDateInfo = (input: string) => {
  const inputDate = getDateConstructor(input)
  const date = inputDate.getDate()
  const month = inputDate.getMonth() + 1 //0-index 
  const year = inputDate.getFullYear()
  const dayIndex = inputDate.getDay()
  const day = getDayOfWeek(inputDate)
  const monthName = getMonth(month)

  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)

  const daysInMonth = lastDayOfMonth.getDate()
  const weeksInMonth = Math.ceil(daysInMonth / 7)

  const daysPassed = date - 1  
  const weeksPassed = Math.floor(daysPassed / 7)
  const week = weeksPassed + 1
  
  return { inputDate, date, month, monthName, year, day, dayIndex, week, firstDayOfMonth, lastDayOfMonth, daysInMonth, weeksInMonth, daysPassed, weeksPassed }
}

export const getDateConstructor = (string: string, withTimes: boolean = false) => {
  const date = string === 'today' ? new Date() : new Date(string)
  if (withTimes === false) date.setHours(0, 0, 0, 0)
  return date
}

export const compareDates = (string1: string, string2: string, withTimes: boolean = false): number => {
  const date1 = getDateConstructor(string1, withTimes)
  const date2 = getDateConstructor(string2, withTimes)
  return date1.toISOString().localeCompare(date2.toISOString())
}

export const getYears = () => {
  const { year } = getDateInfo('today')
  let years = Array.from({length: year - 2012}, (_, index) => 2015 + index)
  return years
}

export const getMonth = (monthIdx: number) => months[monthIdx - 1] // 0-index

export const getDayOfWeek = (date: Date) => daysOfWeek[date.getDay()]

export const getDaysInMonth = (month: number, year: number) => {
  const lastDayOfMonth = new Date(year, month + 1, 0) //month 0-index
  return lastDayOfMonth.getDate()
}

export const getWeekIndex = (date: number) => Math.round(date / 7)

export const getStartDate = (inputDate: string, interval: number) => {
  const date = getDateConstructor(inputDate)
  return new Date(date.getTime() - (interval * 24 * 60 * 60 * 1000))
}

export const dateIsWithinRange = (start: string, end: string, date: string) => {
  return compareDates(start, date) <= 0 && compareDates(date, end) <= 0
}

export const countDaysBetween = (start: string, end: string) => {
  const startDate = start === 'today' ? new Date() : new Date(start)
  const endDate = end === 'today' ? new Date() : new Date(end)
  const timeElapsed = endDate.getTime() - startDate.getTime()
  return  Math.round(timeElapsed / (1000 * 3600 * 24))
}

export const countYearsBetween = (start: string, end: string) => {
  const startDate = start === 'today' ? new Date() : new Date(start)
  const endDate = end === 'today' ? new Date() : new Date(end)
  const timeElapsed = endDate.getTime() - startDate.getTime()
  const timeInYears = timeElapsed / (1000 * 60 * 60 * 24 * 365.25)
  return parseFloat(timeInYears.toFixed(1))
}

export const getDateFromRange = (input: string, unit: string, count: number, direction: number, repeatCount?: any) => {
  //* direction is forward (1) or backward (-) from date
  const { inputDate: output, date, month, year } = getDateInfo(input)
  const day = output.getDay()
  
  if (!repeatCount) {
    const outputMap: Record<string, () => void> = {
      day: () => output.setDate(date + count * direction),
      week: () => output.setDate(date + 7 * count * direction),
      month: () => output.setMonth(month + count * direction),
      year: () => output.setFullYear(year + count * direction),
    }
    outputMap[unit]?.()
    return output
  }
  //* Calculate adjustments based on repeat patterns
  const outputMapWithAdjustments = {
    day: () => output.setDate(date + count * direction),
    week: () => {
      const dayIndex = direction === 1 
        ? repeatCount.findIndex(d => d > day)
        : repeatCount.slice().reverse().findIndex(d => d < day)
      let weekAdjustment: number
      if (dayIndex !== -1) {
        const adjustedIndex = direction === 1 ? dayIndex : repeatCount.length - 1 - dayIndex
        weekAdjustment = repeatCount[adjustedIndex] - day
      } else {
        weekAdjustment = direction === 1  
          ? 7 * count - day + repeatCount[0]
          : - 7 * count - day + repeatCount[repeatCount.length - 1] 
      }
      output.setDate(date + weekAdjustment)
    },
    month: () => {
      const dateIndex = direction === 1
        ? repeatCount.findIndex(d => d > date)
        : repeatCount.slice().reverse().findIndex(d => d < date)
      if (dateIndex !== -1) {
        const adjustedIndex = direction === 1 ? dateIndex : repeatCount.length - 1 - dateIndex
        output.setDate(repeatCount[adjustedIndex])
      } else {
        output.setMonth(month - 1 + count * direction)
        direction === 1 ? output.setDate(repeatCount[0]) : output.setDate(repeatCount[repeatCount.length - 1])
      }
    },
    year: () => {
      const months = Object.keys(repeatCount)
      const dateIndex = repeatCount[month]?.findIndex(d => d === date) ?? -1
      const monthIndex = months.indexOf(String(month))
      
      if (repeatCount[month]?.length > 1 && dateIndex !== -1 && dateIndex < repeatCount[month]?.length - 1) {
        output.setDate(repeatCount[month][dateIndex + 1])
      } else if (months.length > 1 && monthIndex !== -1 && monthIndex < months.length - 1) {
        const nextMonth = repeatCount[months[monthIndex + 1]]
        output.setMonth(nextMonth - 1)
        output.setDate(repeatCount[nextMonth][0])
      } else output.setFullYear(year + count * direction)
    },
  }

  outputMapWithAdjustments[unit]?.()

  return output
}

export function getOrdinalSuffix(n: number) {
  switch (n % 10) {
    case 1: return `${n}st`
    case 2: return `${n}nd`
    case 3: return `${n}rd`
    default: return `${n}th`
  }
}

export function getLocaleDateString(string: string) {
  return getDateConstructor(string, true).toLocaleDateString()
}

export function getCurrentTimeString(string: string = 'now') {
  const date = string === 'now' ? new Date() : new Date(string)

  let hours = date.getHours()
  const amOrPm = hours < 12 ? 'AM' : 'PM'

  hours = hours % 12
  hours = hours ? hours : 12

  const formattedHours = String(hours).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return { time: { hours: formattedHours, minutes, amOrPm }, timeString: `${formattedHours}:${minutes} ${amOrPm}` }
}

export function convertToTimeString({ hours, minutes, amOrPm }: Time) {
  return `${hours}:${minutes} ${amOrPm}`
}