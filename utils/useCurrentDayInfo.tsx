import { useEffect, useState } from "react"
import { getCurrentDate } from "./careUtils"

const useCurrentDayInfo = () => {
  const [today, setToday] = useState
    <{ currDate: number, currMonth: string, monthIdx: number, currYear: number, currWeek: number, daysInMonth: number, weeksInMonth: number, dayOfWeek: string }>
    ({ currDate: 1, currMonth: 'January', monthIdx: 1, currYear: 2024, currWeek: 1, daysInMonth: 31, weeksInMonth: 5, dayOfWeek: 'Monday' })

  useEffect(() => {
    const fetchCurrentDayInfo = () => {
      const { date, month, monthName, year, day, week, daysInMonth, weeksInMonth } = getCurrentDate()
      setToday({currDate: date, currMonth: monthName, monthIdx: month, currYear: year, currWeek: week, daysInMonth: daysInMonth, weeksInMonth: weeksInMonth, dayOfWeek: day})
    }
    fetchCurrentDayInfo()
  }, [])
  return today
}

export default useCurrentDayInfo