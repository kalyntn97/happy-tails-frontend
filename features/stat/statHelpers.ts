import { dateIsWithinRange, getDateFromRange } from "@utils/datetime"
import { Record, StatRange } from "./statInterface"

export const DEFAULT_WEIGHT_UNIT = 'kg'
export const DEFAULT_FOOD_UNIT = 'g'
export const DEFAULT_WATER_UNIT = 'ml'

export const STAT_QUAL_VALUES = ['Very bad', 'Bad', 'Okay', 'Good', 'Very good']

export const WEIGHT_UNITS = [DEFAULT_WEIGHT_UNIT, 'lb']
export const FOOD_UNITS = [DEFAULT_FOOD_UNIT, 'oz']
export const WATER_UNITS = [DEFAULT_WATER_UNIT, 'oz']

export const TIME_RANGES: StatRange[] = ['All', '1D', '1W', '1M', '3M', '6M', '1Y', '5Y']

const unitName = { D: 'day', W: 'week', M: 'month', Y: 'year' }

export const filterByRange = (range: string, records: Record[], startDate: string) => {
  if (range === 'All') return { filtered: records, endDate: null }
  //* range format 'count-unit'
  const count = Number(range[0])
  const unit = unitName[range[1]]
  const endDate = getDateFromRange(startDate ?? 'today', unit, count, -1)
  //* records are sorted desc
  const filtered = records.filter(record => dateIsWithinRange( endDate.toISOString(), startDate, record.createdAt)) 
  return { filtered, endDate }
}

export const STATS = {
  mood: { name: 'Mood', type: 'qual', unit: '', chart: 'bar' },
  weight: { name: 'Weight', type: 'quant', unit: DEFAULT_WEIGHT_UNIT, chart: 'line' },
  energy: { name: 'Energy', type: 'qual', unit: '', chart: 'bar' },
  sleep: { name: 'Sleep', type: 'qual', unit: '', chart: 'bar' },
  appetite: { name: 'Appetite', type: 'qual', unit: '', chart: 'bar' },
  wetFood: { name: 'Wet food', type: 'quant', unit: DEFAULT_FOOD_UNIT, chart: 'bar' },
  dryFood: { name: 'Dry food', type: 'quant', unit: DEFAULT_FOOD_UNIT, chart: 'bar' },
  treats: { name: 'Treats', type: 'quant', unit: DEFAULT_FOOD_UNIT, chart: 'bar' },
  water: { name: 'Water', type: 'mixed', unit: DEFAULT_WATER_UNIT, chart: 'bar' },
  vomit: { name: 'Vomit', type: 'mixed', unit: '', chart: 'bar' },
  urine: { name: 'Urine', type: 'mixed', unit: '', chart: 'bar' },
  feces: { name: 'Feces', type: 'mixed', unit: '', chart: 'bar' },
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

export const getAverageValue = (arr: Array<number>) => {
  const sum = arr.reduce((acc, curr) => acc + curr, 0)
  return (sum / arr.length).toFixed(1)
}