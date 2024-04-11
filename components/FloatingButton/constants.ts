import { Colors, Spacing, Forms } from "@styles/index";
import { ViewStyle } from "react-native";

export const ButtonStyles = {
  width: 60, 
  height: 60, 
  margin: 30, 
  borderRadius: '50%', 
  backgroundColor: Colors.pink.reg, 
  textColor: Colors.white
}

export const Button: ViewStyle = {
  width: ButtonStyles.width,
  height: ButtonStyles.height,
  backgroundColor: ButtonStyles.backgroundColor,
  borderRadius: ButtonStyles.borderRadius,
  ...Spacing.centered,
  ...Forms.boxShadow,
}

export const Animation = {
  starting_position: 0,
  rotation_open: 225,
  children_opacity_open: 1,
  children_position_Y_open: 1,
  plus_translate_Y_open: -3
}

export const ChildrenAnimation = {
  children_opacity_close: 0,
  children_position_y_close: 100,
  rotation_close: 0,
  plus_translate_y_close: -2,
}

export const subBtn_tap_event = 'subBtn_tap_event'

