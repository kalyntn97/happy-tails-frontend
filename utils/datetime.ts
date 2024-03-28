export const getDateInfo = (input: Date) => {
  const inputDate = new Date(input)
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
  
  return { date, month, monthName, year, day, week, firstDayOfMonth, daysInMonth, weeksInMonth, daysPassed, weeksPassed }
}

export const getDateConstructor = (dateString: Date): Date => {
  return new Date(
    new Date(dateString).getFullYear(),
    new Date(dateString).getMonth(),
    new Date(dateString).getDate(),
  )
}

export const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

export const getYears = () => {
  const { year } = getDateInfo(new Date())
  let years = Array.from({length: year - 2023}, (_, index) => 2024 + index)
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

export const getStartDate = (inputDate: Date, interval: number) => {
  return new Date(inputDate.getTime() - (interval * 24 * 60 * 60 * 1000))
}