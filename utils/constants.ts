import { TAB_BAR_HEIGHT } from "@navigation/NavigationStyles"
import { Dimensions } from "react-native"
import { Frequency } from "./types"

export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export const centerHeight = windowHeight - TAB_BAR_HEIGHT

export const FREQUENCY_TYPES: Frequency['type'][] = ['days', 'weeks', 'months', 'years']