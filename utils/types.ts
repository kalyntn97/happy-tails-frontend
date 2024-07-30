export type Frequency = {
  type: 'days' | 'weeks' | 'months' | 'years'
  interval: number
  timesPerInterval: any[]
}

export type FormErrors= { [key: string]: string }