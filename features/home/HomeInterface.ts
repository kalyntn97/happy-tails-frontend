import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"
import { Frequency } from "@utils/types"

export type ClickedTask = {
  item: Care | Health
  type: string
}

export type Feed = 'care' | 'health'

export type Filter = Frequency['type'] | 'oneTime' | 'all'
