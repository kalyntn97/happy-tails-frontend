import { Care } from "@care/CareInterface"
import { Health, Visit } from "@health/HealthInterface"
import { useReminderInterval } from "@store/store"
import { compareDates, getDateConstructor, getStartDate } from "@utils/datetime"

export const shouldRenderCareTask = (item: Care, selectedDate: Date) => {
  const { date: startDate, endDate, repeat } = item
  const selectedDateString = selectedDate.toString()
  const isRepeating = repeat
    && compareDates(selectedDateString, startDate) >= 0
    && (!endDate || compareDates(selectedDateString, endDate) === -1)
  const isOneTime = !item.repeat
    && compareDates(selectedDateString, startDate) === 0
  return isRepeating || isOneTime
}

export const shouldRenderHealthTask = (item: Health, selectedDate: Date, reminderInterval: number) => {
  const startDate = getStartDate(item.nextDue.date, reminderInterval) //start date to show task
  let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
    new Date(visit.date).getMonth() === selectedDate.getMonth() && new Date(visit.date).getFullYear() === selectedDate.getFullYear()
  ).sort((a: Visit, b: Visit) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const due: boolean = selectedDate >= startDate
  const done: boolean = filteredVisits.length >= 1
  return due || done
}