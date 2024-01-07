import { ImageSourcePropType } from "react-native"

export const getIconSource  = (name: string): ImageSourcePropType => {
  switch (name) {
    default: 
      return require('../assets/icons/paw.png')
    case 'Teeth Brushing':
      return require('../assets/icons/toothbrush.png')
    case 'Nail Clipping':
      return require('../assets/icons/clippers.png')
    case 'Daily Walks':
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
  const date = new Date().getDate()
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  const day = getDaysOfWeek(new Date())

  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)

  const daysInMonth = lastDayOfMonth.getDate()
  const weeksInMonth = Math.ceil((daysInMonth + firstDayOfMonth.getDay()) / 7)
  

  
  return { date: date, month: month, year: year, day: day, daysInMonth: daysInMonth }
}

