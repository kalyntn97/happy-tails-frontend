import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"
import { Frequency } from "@utils/types"

export type ClickedItem = { 
  item: Care | Health
  type: string
}

export type Feed = 'care' | 'health'

export type Filter = Frequency['type'] | 'oneTime' | 'all'
