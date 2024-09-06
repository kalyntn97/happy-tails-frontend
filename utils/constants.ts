import { TAB_BAR_HEIGHT } from "@navigation/NavigationStyles"
import { Dimensions } from "react-native"
import { Frequency } from "./types"
import { FrequencyPicker } from "@components/Pickers/FrequencyPicker"

export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export const centerHeight = windowHeight - TAB_BAR_HEIGHT

export const FREQUENCY_TYPES: Frequency['type'][] = ['days', 'weeks', 'months', 'years']

export const DEFAULT_FREQUENCY: FrequencyPicker = { type: 'days', interval: 1, timesPerInterval: [1] }