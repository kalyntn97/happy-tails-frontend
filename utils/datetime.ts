export const getDateInfo = (input: string) => {
  const inputDate = input === 'today' ? new Date() : new Date(input)
  const date = inputDate.getDate()
  const month = inputDate.getMonth() + 1 //0-index 
  const year = inputDate.getFullYear()
  const day = getDayOfWeek(inputDate)
  const monthName = getMonth(month)

  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)

  const daysInMonth = lastDayOfMonth.getDate()
  const weeksInMonth = Math.ceil(daysInMonth / 7)

  const daysPassed = date - 1  
  const weeksPassed = Math.floor(daysPassed / 7)
  const week = weeksPassed + 1
  
  return { inputDate, date, month, monthName, year, day, week, firstDayOfMonth, lastDayOfMonth, daysInMonth, weeksInMonth, daysPassed, weeksPassed }
}

export const getDateConstructor = (dateString: string): Date => {
  const date = new Date(dateString)
  date.setHours(0, 0, 0, 0)
  return date
}

export const compareDates = (string1: string, string2: string): number => {
  const date1 = string1 === 'today' ? new Date() : new Date(string1)
  const date2 = string2 === 'today' ? new Date() : new Date(string2)
  return date1.toISOString().localeCompare(date2.toISOString())
}

export const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

export const getYears = () => {
  const { year } = getDateInfo('today')
  let years = Array.from({length: year - 2012}, (_, index) => 2015 + index)
  return years
}

export const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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

export const dateIsWithinRange = (start: Date, end: Date) => {
  return new Date(start) <= new Date()
  && (!end || new Date(end) >= new Date())
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
  return parseFloat(timeInYears.toFixed(2))
}

export const getDateFromRange = (input: string, unit: string, count: number, direction: number) => {
  //* direction is forward (1) or backward (-) from date
  const { inputDate: output, date, month, year } = getDateInfo(input)
  const outputMap: Record<string, () => void> = {
    day: () => output.setDate(date + count * direction),
    week: () => output.setDate(date + 7 * count * direction),
    month: () => output.setMonth(month + count * direction),
    year: () => output.setFullYear(year + count * direction),
  }
  const getOutputDate = outputMap[unit]
  if (getOutputDate) getOutputDate()
  return output
}