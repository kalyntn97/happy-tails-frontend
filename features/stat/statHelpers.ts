export const STATS = {
  mood: { name: 'Mood', type: 'qual' },
  appetite: { name: 'Appetite', type: 'qual' },
  energy: { name: 'Energy', type: 'qual' },
  sleep: { name: 'Sleep', type: 'qual' },
  vomit: { name: 'Vomit', type: 'mixed', unit: '' },
  urine: { name: 'Urine', type: 'mixed', unit: '' },
  feces: { name: 'Feces', type: 'mixed', unit: '' },
  water: { name: 'Water', type: 'mixed', unit: '' },
  dryFood: { name: 'Dry food', type: 'quant', unit: 'g' },
  wetFood: { name: 'Wet food', type: 'quant', unit: 'g' },
  treats: { name: 'Treats', type: 'quant', unit: 'g' },
  weight: { name: 'Weight', type: 'quant', unit: 'kg' },
}

export const STAT_QUAL_VALUES = ['Very bad', 'Bad', 'Okay', 'Good', 'Very good']

export const WEIGHT_UNITS = ['kg', 'lb']
export const FOOD_UNITS = ['g', 'oz']
export const WATER_UNITS = ['ml']

export const weightConverter = (input: string, outputUnit: string) => {
  if (outputUnit === 'lbs') {
    return (Number(input) * 2.2046).toFixed(1)
  } else {
    return (Number(input) / 2.2046).toFixed(1)
  }
}
