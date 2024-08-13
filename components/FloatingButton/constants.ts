import { Colors, Spacing, UI } from "@styles/index";
import { ViewStyle } from "react-native";

export const ButtonStyles = {
  width: 60, 
  height: 60, 
  margin: 30, 
  borderRadius: 99, 
  backgroundColor: Colors.pink.reg, 
  textColor: Colors.white,
  labelColor: UI.lightPalette().focused,
}

export const Button: ViewStyle = {
  width: ButtonStyles.width,
  height: ButtonStyles.height,
  backgroundColor: ButtonStyles.backgroundColor,
  borderRadius: ButtonStyles.borderRadius,
  ...Spacing.centered,
  ...UI.boxShadow,
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

export const snapThreshold = ButtonStyles.width + ButtonStyles.margin * 2
