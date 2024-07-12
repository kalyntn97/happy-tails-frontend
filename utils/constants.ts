import { TAB_BAR_HEIGHT } from "@navigation/NavigationStyles"
import { Dimensions } from "react-native"

export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export const centerHeight = windowHeight - TAB_BAR_HEIGHT