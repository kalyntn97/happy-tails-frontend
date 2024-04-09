import { Care } from "@care/CareInterface"
import { Health, Visit } from "@health/HealthInterface"
import { useReminderInterval } from "@store/store"
import { getDateConstructor, getStartDate } from "@utils/datetime"

export const shouldRenderCareTask = (item: Care, selectedDate: Date) => {
  const startDate = getDateConstructor(item.date)
  const endDate = item.endDate && getDateConstructor(item.endDate)
  const isRepeating = item.repeat //render repeating tasks between start and end dates
    && selectedDate >= startDate 
    && (!endDate || selectedDate <= endDate)
  const isOneTime = !item.repeat //only render one-time task on the date
    &&selectedDate.toLocaleDateString() == new Date(item.date).toLocaleDateString()
  return isRepeating || isOneTime
}

export const shouldRenderHealthTask = (item: Health, selectedDate: Date, reminderInterval) => {
  const startDate = getStartDate(new Date(item.nextDue.date), reminderInterval) //start date to show task
  let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
    new Date(visit.date).getMonth() === selectedDate.getMonth() && new Date(visit.date).getFullYear() === selectedDate.getFullYear()
  ).sort((a: Visit, b: Visit) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const due: boolean = selectedDate >= startDate
  const done: boolean = filteredVisits.length >= 1
  return due || done
}