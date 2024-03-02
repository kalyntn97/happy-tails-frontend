export const getCurrentDate = () => {
  const today = new Date()
  const date = today.getDate()
  const month = today.getMonth() + 1 //0-index 
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

export const getMonth = (monthIdx: number) => {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ]
  return months[monthIdx - 1] // 0-index
}

export const getDayOfWeek = (date: Date) => {
  const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return daysOfWeek[date.getDay()]
}

