import { Care } from "@care/CareInterface"
import { Health, Visit } from "@health/HealthInterface"
import { useReminderInterval } from "@store/store"
import { compareDates, getDateConstructor, getStartDate } from "@utils/datetime"

export const shouldRenderCareTask = (item: Care, selectedDate: Date) => {
  const { date, endDate, repeat } = item
  const selectedDateString = selectedDate.toString()
  const isRepeating = repeat
    && compareDates(selectedDate.toString(), date) === 1
    && (!endDate || compareDates(selectedDateString, endDate) === -1)
  const isOneTime = !item.repeat
    && compareDates(selectedDateString, date) === 0
  return isRepeating || isOneTime
}

export const shouldRenderHealthTask = (item: Health, selectedDate: Date, reminderInterval: number) => {
  const startDate = getStartDate(item.nextDue.date, reminderInterval) //start date to show task
  let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
    new Date(visit.date).getMonth() === selectedDate.getMonth() && new Date(visit.date).getFullYear() === selectedDate.getFullYear()
  ).sort((a: Visit, b: Visit) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const due: boolean = selectedDate >= startDate
  const done: boolean = filteredVisits.length >= 1
  return due || done
}