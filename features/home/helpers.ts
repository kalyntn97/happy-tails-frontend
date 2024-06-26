import { Care } from "@care/CareInterface"
import { Health, Visit } from "@health/HealthInterface"
import { compareDates, getDateConstructor, getStartDate } from "@utils/datetime"
import { Dimensions } from "react-native"

export const shouldRenderCareTask = (item: Care, selectedDate: Date) => {
  const { date: date, endDate, repeat } = item
  const selectedDateString = selectedDate.toISOString()
  const startDate = getDateConstructor(date).toISOString()
  const isRepeating = repeat
    && compareDates(selectedDateString, startDate) >= 0
    && (!endDate || compareDates(selectedDateString, endDate) === -1)
  const isOneTime = !item.repeat
    && compareDates(selectedDateString, startDate) === 0
  return isRepeating || isOneTime
}

export const shouldRenderHealthTask = (item: Health, selectedDate: Date, healthInterval: number) => {
  const startDate = getStartDate(item.nextDue.date, healthInterval) //start date to show task
  let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
    new Date(visit.date).getMonth() === selectedDate.getMonth() && new Date(visit.date).getFullYear() === selectedDate.getFullYear()
  ).sort((a: Visit, b: Visit) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const due: boolean = selectedDate >= startDate
  const done: boolean = filteredVisits.length >= 1
  return due || done
}

export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export const centerHeight = windowHeight - 191 - windowHeight * 0.11