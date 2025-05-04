export type Frequency = {
  type: 'days' | 'weeks' | 'months' | 'years'
  interval: number
  timesPerInterval: any[]
}

export type FormErrors= { [key: string]: string }

export interface Attachment {
  name: string
  url: string
  tag: 'invoice' | 'receipt' | 'lab' | 'notes' | 'others'
  event: string
  pet: string
  notes: string | null
}
