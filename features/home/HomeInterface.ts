import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"

export type ClickedTask = {
  item: Care | Health
  type: string
}

export type Selection = 'day' | 'week' | 'month' | 'year'

export type Feed = 'care' | 'health'