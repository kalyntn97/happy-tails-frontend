import { compareDates, getDateFromRange, getDateInfo, isSameDates } from "@utils/datetime"
import { Record } from "./statInterface"

export const DEFAULT_WEIGHT_UNIT = 'kg'
export const DEFAULT_FOOD_UNIT = 'g'
export const DEFAULT_WATER_UNIT = 'ml'

export const STAT_QUAL_VALUES = ['Very bad', 'Bad', 'Okay', 'Good', 'Very good']

export const WEIGHT_UNITS = [DEFAULT_WEIGHT_UNIT, 'lb']
export const FOOD_UNITS = [DEFAULT_FOOD_UNIT, 'oz']
export const WATER_UNITS = [DEFAULT_WATER_UNIT, 'oz']

export const CHART_PARAMS = {
  range: ['All', '1D', '1W', '1M', '1Y', '5Y'],
}

const unitName = { D: 'day', W: 'week', M: 'month', Y: 'year' }

export const filterByRange = (range: string, records: Record[]) => {
  if (range === 'All') return records
  //* range format 'count-unit'
  const count = Number(range[0])
  const unit = unitName[range[1]]
  const endDate = getDateFromRange('today', unit, count, -1).toString()
  return records.filter(record => compareDates(record.createdAt, endDate) >= 0)
}

export const STATS = {
  mood: { name: 'Mood', type: 'qual' },
  appetite: { name: 'Appetite', type: 'qual' },
  energy: { name: 'Energy', type: 'qual' },
  sleep: { name: 'Sleep', type: 'qual' },
  vomit: { name: 'Vomit', type: 'mixed', unit: '' },
  urine: { name: 'Urine', type: 'mixed', unit: '' },
  feces: { name: 'Feces', type: 'mixed', unit: '' },
  water: { name: 'Water', type: 'mixed', unit: DEFAULT_WATER_UNIT },
  dryFood: { name: 'Dry food', type: 'quant', unit: DEFAULT_FOOD_UNIT },
  wetFood: { name: 'Wet food', type: 'quant', unit: DEFAULT_FOOD_UNIT },
  treats: { name: 'Treats', type: 'quant', unit: DEFAULT_FOOD_UNIT },
  weight: { name: 'Weight', type: 'quant', unit: DEFAULT_WEIGHT_UNIT },
}

export const getUnitKey = (name: string) => {
  const map = {
    weight: 'weight',
    water: 'water',
    dryFood: 'food',
    wetFood: 'food',
    treats: 'food',
  }
  return map[name]
}

export const statConverter = (key: string, input: string, outputUnit: string) => {
  const map = {
    weight: weightConverter(input, outputUnit),
  }
  return map[key]
}

export const weightConverter = (input: string, outputUnit: string) => {
  if (outputUnit === 'lb') {
    return (Number(input) * 2.2046).toFixed(1)
  } else {
    return (Number(input) / 2.2046).toFixed(1)
  }
}
